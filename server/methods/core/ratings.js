import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import _ from "lodash";
import { Reaction, Logger } from "/server/api";
import { Accounts, Groups, Ratings } from "/lib/collections";

/**
 * @file Methods for creating and managing admin user permission groups.
 * Run these methods using `Meteor.call()`.
 * @example Meteor.call("group/createGroup", sampleCustomerGroup, shop._id)
 * @namespace Methods/Group
*/
Meteor.methods({
  /**
   * @name group/createGroup
   * @method
   * @memberof Methods/Group
   * @summary Creates a new permission group for a shop
   * It creates permission group for a given shop with passed in roles
   * @param {Object} groupData - info about group to create
   * @param {String} groupData.name - name of the group to be created
   * @param {String} groupData.description - Optional description of the group to be created
   * @param {Array} groupData.permissions - permissions to assign to the group being created
   * @param {String} shopId - id of the shop the group belongs to
   * @return {Object} - `object.status` of 200 on success or Error object on failure
   */
  "ratings/addRatings": function (userId, productId, ratingsScore) {
    check(userId, String);
    check(productId, String);
    check(ratingsScore, Number);
    let _id;

    const ratingsData = { userId, productId, ratingsScore };

    try {
      _id = Ratings.insert(ratingsData);
    } catch (error) {
      Logger.error(error);
      throw new Meteor.Error(400, "Bad request");
    }

    return { status: 200, ratings: Ratings.findOne({ _id }) };
  }

});
