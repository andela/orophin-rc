import { Meteor } from "meteor/meteor";
import { compose, withProps } from "recompose";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";

import { Reaction } from "/client/api";
import { Accounts } from "/lib/collections";
import { Wallets, WalletHistories  } from "/lib/collections";

import { Paystack } from "../../../../payments-paystack/lib/api";

import WalletDashboard from "../components/walletDashboard";

const handlers = {
  fundWallet: function fundWallet(amount) {
    return new Promise((resolve, reject) => {
      if (amount <= 0) {
        return reject({
          message: "invalid amount, please try again",
          type: "error"
        });
      }

      Meteor.subscribe("Packages", Reaction.getShopId());

      const email = Accounts.findOne({ _id: Meteor.userId() }).emails[0].address;

      Meteor.call("paystack/get-public-key", Reaction.getShopId(), (getPublicKeyError, { publicKey, secretKey }) => {
        if (!getPublicKeyError) {
          const payload = {
            key: publicKey,
            email,
            amount: (amount * 100),
            currency: "NGN",
            callback: function (response) {
              const { reference } = response;
              Paystack.verify(reference, secretKey, (paystackVerifyError, res) => {
                if (paystackVerifyError) {
                  reject({
                    message: paystackVerifyError.message,
                    type: "error"
                  });
                } else {
                  Meteor.call("wallet/get-user-walletId", email, (getWalletIdError, walletId) => {
                    const transaction = {
                      amount: (res.data.amount / 100),
                      transactionType: "credit",
                      walletId,
                      from: email,
                      to: email
                    };

                    resolve({
                      message: "Wallet funded successfully",
                      type: "success"
                    });

                    Meteor.call("wallet/insert-transaction", transaction);
                    Meteor.call("wallet/update-balance", transaction);
                  });
                }
              });
            },
            onClose: function () {
              reject({
                message: "paystack-popup-close",
                type: "warning"
              });
            }
          };
          PaystackPop.setup(payload).openIframe();
        } else {
          reject({
            message: getPublicKeyError,
            type: "error"
          });
        }
      });
    });
  },

  transferToWallet: function transferToWallet(amount, receiverEmail, senderWallet) {
    const {
      _id: senderWalletId,
      ownerEmail: senderEmail,
      balance: senderBalance
    } = senderWallet;

    return new Promise((resolve, reject) => {
      if (receiverEmail === senderEmail) {
        return reject({
          message: "You can't transfer to yourself",
          type: "errror"
        });
      }

      if (amount <= 0) {
        return reject({
          message: "invalid amount, please try again",
          type: "error"
        });
      }

      if (amount > senderBalance) {
        return reject({
          message: "You dont have enough for this transfer, please fund your wallet",
          type: "error"
        });
      }

      Meteor.call("wallet/get-user-walletId", receiverEmail, (getWalletIdError, receiverWalletId) => {
        if (getWalletIdError) {
          return reject({
            message: getWalletIdError.message,
            type: "error"
          });
        }
        const senderTransaction = {
          amount: parseInt(amount, 10),
          transactionType: "debit",
          walletId: senderWalletId,
          from: senderEmail,
          to: receiverEmail
        };
        const receiverTransaction = {
          amount: parseInt(amount, 10),
          transactionType: "credit",
          walletId: receiverWalletId,
          from: senderEmail,
          to: receiverEmail
        };

        const transactions = [senderTransaction, receiverTransaction];
        transactions.forEach((transaction) => {
          Meteor.call("wallet/update-balance", transaction);
          Meteor.call("wallet/insert-transaction", transaction);
        });

        resolve({
          message: `Transfer to ${receiverEmail} successful`,
          type: "success"
        });
      });
    });
  },

  fetchWalletHistory: function fetchWalletHistory(page = 1, limit = 5) {
    const offset = (page - 1) * limit;
    const walletHistoryCount = WalletHistories.find({}).count();

    const pagesCount = Math.ceil(walletHistoryCount / limit);

    const walletHistory =  WalletHistories.find({}, {
      sort: { createdAt: -1 },
      limit: limit,
      skip: offset
    }).fetch();

    return {
      walletHistory,
      pagesCount
    };
  }
};

function composer(props, onData) {
  const subcription = Meteor.subscribe("UserWallet");
  if (subcription.ready()) {
    const wallet = Wallets.find({}).fetch()[0];

    const { walletHistory, pagesCount } = handlers.fetchWalletHistory();

    onData(null, { wallet,  walletHistory, pagesCount });
  }
}

registerComponent("WalletDashboard", WalletDashboard, [
  withProps(handlers),
  composeWithTracker(composer)
]);

export default compose(
  withProps(handlers),
  composeWithTracker(composer)
)(WalletDashboard);
