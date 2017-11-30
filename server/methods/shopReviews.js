import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import {
  insert,
  update,
  remove
} from "./reviewMethods";

const { ShopReviews } = Collections;

Meteor.methods({
  "insert/ShopReviews"(review) {
    insert(ShopReviews, review);
  },
  "update/ShopReviews"(reviewId, user, content) {
    update(ShopReviews, reviewId, user, content);
  },
  "remove/ShopReviews"(reviewId, reviewer) {
    remove(ShopReviews, reviewId, reviewer);
  }
});
