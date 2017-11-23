import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import * as Collections from "/lib/collections";

const { Reviews } = Collections;

/**
 * @summary sure that only the user who created a recipe can perform any action on it.
 * @param {String} reviewId
 * @return {boolean}
 */
const isViewer = (reviewId) => {
  const review = Reviews.findOne({
    _id: reviewId,
    reviewerId: Meteor.userId
  });
  if (review) return true;
  return false;
};

Meteor.methods({
  "insert/Reviews"(review) {
    check(review, Object);
    Collections.Reviews.insert(review);
  },
  "update/Reviews"(reviewId, content) {
    check(reviewId, String);
    check(content, String);
    if (!isViewer(reviewId)) return;
    Reviews.update(reviewId, {
      $set: { content }
    });
  },
  "delete/Reviews"(reviewId) {
    check(reviewId, String);
    if (!isViewer(reviewId)) return;
    Reviews.remove({ _id: reviewId });
  }
});
