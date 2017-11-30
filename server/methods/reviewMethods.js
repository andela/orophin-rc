import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

/**
 * @summary sure that only the user who created a recipe can perform any action on it.
 * @param {String} reviewId
 * @return {boolean}
 */
const isViewer = (collectionType, reviewId, reviewer) => {
  const review = collectionType.findOne({
    _id: reviewId,
    reviewer
  });
  if (review) return true;
  return false;
};


export const insert = (collectionType, review) => {
  check(review, Object);
  collectionType.insert(review);
};
export const update = (collectionType, reviewId, user, content) => {
  check(reviewId, String);
  check(user, String);
  check(content, String);
  if (!isViewer(collectionType, reviewId, user)) {
    throw new Meteor.Error("access-denied", "You don't have permission to delete this review");
  }
  collectionType.update(reviewId, {
    $set: { content }
  });
};
export const remove = (collectionType, reviewId, reviewer) => {
  check(reviewId, String);
  check(reviewer, String);
  if (!isViewer(collectionType, reviewId, reviewer)) {
    throw new Meteor.Error("access-denied", "You don't have permission to delete this review");
  }
  collectionType.remove({ _id: reviewId });
};

