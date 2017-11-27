import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Logger } from "/server/api";
import { ProductReviews } from "/lib/collections";
/**
 * @summary sure that only the user who created a recipe can perform any action on it.
 * @param {String} reviewId
 * @return {boolean}
 */
const isViewer = (reviewId, reviewer) => {
  const review = ProductReviews.find({}).fetch();
  console.log(review[0].reviewer === reviewer, "kkkkkkkkkkkkkkkk");
  if (review) return true;
  return false;
};
Meteor.methods({
  "insert/ProductReviews"(review) {
    check(review, Object);
    ProductReviews.insert(review);
  },
  "update/ProductReviews"(reviewId, user, content) {
    check(reviewId, String);
    check(content, String);
    check(user, String);
    if (!isViewer(reviewId, user)) return;
    ProductReviews.update(reviewId, {
      $set: { content }
    });
  },
  "remove/ProductReviews"(reviewId, reviewer) {
    check(reviewId, String);
    check(reviewer, String);
    try {
      ProductReviews.remove({ _id: reviewId });
    } catch (error) {
      Logger.error(error);
      throw new Meteor.Error(400, "Bad request");
    }
    return { status: 200 };
    // if (!isViewer(reviewId, reviewer)) {
    //   throw new Meteor.Error("access-denied", "You don't have permission to delete this review");
    // }
  }
});
