/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { AutoForm } from "meteor/aldeed:autoform";
import { $ } from "meteor/jquery";
import { Reaction } from "/client/api";
import { Cart, Packages } from "/lib/collections";
import { Paystack } from "../../lib/api";
import * as Collections from "/lib/collections";
import { PaystackPayment } from "../../lib/collections/schemas";

import "./paystack.html";

const submitting = false;

function uiEnd(template, buttonText) {
  template.$(":input").removeAttr("disabled");
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

function paymentAlert(template, errorMessage) {
  // return $(".alert").removeClass("hidden").text(errorMessage);
  $("#paystackPaymentForm").find(".alert").removeClass("hidden").text(
    errorMessage || "An error occurred. Kindldy check the details you entered");
}

function hidePaymentAlert() {
  return $(".alert").addClass("hidden").text("");
}

function handlePaystackSubmitError(error) {
  console.error(error);
  const serverError = error !== null ? error.message : void 0;
  if (serverError) {
    return paymentAlert("Oops! " + serverError);
  } else if (error) {
    return paymentAlert("Oops! " + error, null, 4);
  }
}

/**
 * @method getTargetAccount
 * @summary gets the account of the userId in the route, or the current user.
 * @since 1.5.0
 * @return {Object} - the account of the identified user.
 */
function getTargetAccount() {
  const targetUserId = Reaction.Router.getQueryParam("userId") || Meteor.userId();
  const account = Collections.Accounts.findOne(targetUserId);

  return account;
}

/**
 * @method displayEmail
 * @summary returns a user's email.
 * @since 1.5.0
 * @return {String} - the email of a given user.
 */
function displayEmail() {
  if (Reaction.Subscriptions && Reaction.Subscriptions.Account && Reaction.Subscriptions.Account.ready()) {
    const account = getTargetAccount();

    if (account && Array.isArray(account.emails)) {
      const defaultEmail = account.emails.find((email) => email.provides === "default");
      return defaultEmail.address;
    }
  }
}

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

AutoForm.addHooks("paystack-payment-form", {
  onSubmit: function () {
    this.event.preventDefault();
    const template = this.template;
    Meteor.subscribe("Packages", Reaction.getShopId());
    const packageData = Packages.findOne({
      name: "paystack-paymentmethod",
      shopId: Reaction.getShopId()
    });
    const cart = Cart.findOne();

    Meteor.call("paystack/get-public-key", Reaction.getShopId(), (err, { publicKey, secretKey }) => {
      if (!err) {
        const payload = {
          key: publicKey,
          email: displayEmail(),
          amount: (cart.getTotal() * 100),
          currency: "NGN",
          callback: function (response) {
            const { reference } = response;
            Paystack.verify(reference, secretKey, (error, res) => {
              if (err) {
                handlePaystackSubmitError(err);
                uiEnd(template, "Resubmit payment");
              } else {
                const transaction = res.data;
                const paymentMethod = {
                  processor: "Paystack",
                  paymentPackageId: packageData._id,
                  storedCard: transaction.authorization.card_type,
                  paymentSettingsKey: packageData.registry[0].settingsKey,
                  method: "credit",
                  transactionId: transaction.reference,
                  currency: transaction.currency,
                  amount: transaction.amount / 100,
                  status: "passed",
                  mode: "authorize",
                  createdAt: new Date(),
                  transactions: []
                };

                Alerts.toast("Transaction successful");
                paymentMethod.transactions.push(transaction.authorization);
                Meteor.call("cart/submitPayment", paymentMethod);
              }
            });
          },
          onClose: function () {
            uiEnd(template, "Checkout with paystack");
          }
        };
        try {
          PaystackPop.setup(payload).openIframe();
        } catch (error) {
          handlePaystackSubmitError(template, error);
          uiEnd(template, "Resubmit payment");
        }
      } else {
        // admin issue not user related
        handlePaystackSubmitError(err);
        uiEnd(template, "Resubmit payment");
      }
    });
  },
  beginSubmit: function () {
    this.template.$(":input").attr("disabled", true);
    this.template.$("#btn-complete-order").text("Submitting ");
    return this.template.$("#btn-processing").removeClass("hidden");
  },
  endSubmit: function () {
    if (!submitting) {
      return uiEnd(this.template, "Checkout with paystack");
    }
  }
});
