import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import {
  insert,
  update,
  remove
} from "./reviewMethods";

const { ProductReviews } = Collections;

Meteor.methods({
  "insert/ProductReviews"(review) {
    insert(ProductReviews, review);
  },
  "update/ProductReviews"(reviewId, user, content) {
    update(ProductReviews, reviewId, user, content);
  },
  "remove/ProductReviews"(reviewId, reviewer) {
    remove(ProductReviews, reviewId, reviewer);
  }
});
