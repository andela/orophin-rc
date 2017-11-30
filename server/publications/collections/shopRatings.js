import { ShopRatings } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
/**
 * productRatings publication
 * @param {String} shopId - id of the current shop
 * @return {Object} return product cursor
 */
Meteor.publish("ShopRatings", function (shopId) {
  check(shopId, String);
  if (!shopId) {
    return this.ready();
  }
  return ShopRatings.find({ rateeId: shopId });
});
