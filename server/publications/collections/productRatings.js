import { ProductRatings } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
/**
 * productRatings publication
 * @param {String} productId - id of the current product
 * @return {Object} return product cursor
 */
Meteor.publish("ProductRatings", function (productId) {
  check(productId, String);
  if (!productId) {
    return this.ready();
  }
  return ProductRatings.find({ rateeId: productId });
});
