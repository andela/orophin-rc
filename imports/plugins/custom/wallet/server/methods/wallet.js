/* eslint camelcase: 0 */
// meteor modules
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
// reaction modules
import { Wallets } from "/lib/collections";

Meteor.methods({

  /**
   * Fetch paystack public set by shop owner in the settings dashboard
   * @param  {String} shopId
   * @return {String} publicKey
   */
  "wallet/create-user-wallet": function (ownerEmail) {
    check(ownerEmail, String);
    Wallets.insert({ ownerEmail });
    console.log(Wallets.find({}).fetch());
  }
});
