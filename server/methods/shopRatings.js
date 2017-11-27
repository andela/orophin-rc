import * as Collections from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Logger } from "/server/api";
import { ShopRatings } from "/lib/collections";

/**
 * @summary sure that only the user who created a recipe can perform any action on it.
 * @param {String} reviewId
 * @return {boolean}
 */
const isViewer = (id) => {
  const ratings = ShopRatings.findOne({
    _id: id,
    userId: Meteor.userId()
  });
  if (ratings) return true;
  return false;
};
Meteor.methods({
  /**
   * @name insert/ShopRatings
   * @method
   * @memberof Methods/ProductRatings
   * @summary creates record for user ratings
   * @param {Object} ratings - info about ratinngs to create
   * @return {Object} - `object.status` of 201 on success or Error object on failure
   */
  "insert/ShopRatings"(ratings) {
    check(ratings, Object);
    try {
      Collections.ShopRatings.insert(ratings);
    } catch (error) {
      Logger.error(error);
      throw new Meteor.Error(400, "Bad request");
    }
    return { status: 201, ratings: ShopRatings.findOne({ ratings }) };
  },

  /**
   * @name update/ShopRatings
   * @method
   * @memberof Methods/ShopRatings
   * @summary updates user ratings score
   * @param {String} id - id of the current record
   * @param {Number} ratingsScore - updated ratings score
   * @return {Object} - `object.status` of 200 on success or Error object on failure
   */
  "update/ShopRatings"(id, ratingsScore) {
    check(id, String);
    check(ratingsScore, Number);
    if (!isViewer(id)) return;
    try {
      ShopRatings.update(id, {
        $set: { ratingsScore }
      });
    } catch (error) {
      Logger.error(error);
      throw new Meteor.Error(400, "Bad request");
    }
    return { status: 200 };
  }
});
