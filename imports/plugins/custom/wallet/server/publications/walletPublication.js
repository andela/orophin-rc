import { Meteor } from "meteor/meteor";
import { Accounts, Wallets, WalletHistories } from "/lib/collections";

/**
 * Wallet publication
 * @return {Array} return wallet and wallethistroy cursor
 */
Meteor.publish("UserWallet", function () {
  if (!this.userId) {
    return this.ready();
  }
  const owner = Accounts.findOne({ _id: this.userId });
  if (owner.emails.length === 0) {
    return this.ready();
  }
  const ownerEmail = owner.emails[0].address;
  const wallet = Wallets.find({ ownerEmail }).fetch();

  return [
    Wallets.find({ ownerEmail }),
    WalletHistories.find({ walletId: wallet[0]._id })
  ];
});
