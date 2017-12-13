/* eslint camelcase: 0 */
// meteor modules
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
// reaction modules
import { Packages } from "/lib/collections";

Meteor.methods({

  /**
   * Fetch paystack public set by shop owner in the settings dashboard
   * @param  {String} shopId
   * @return {String} publicKey
   */
  "paystack/get-public-key": function (shopId) {
    check(shopId, String);
    const packageData = Packages.findOne({
      name: "paystack-paymentmethod",
      shopId
    });
    const {
      publicKey,
      secretKey
    } = packageData.settings["paystack-paymentmethod"];
    return {
      publicKey,
      secretKey
    };
  }
});
