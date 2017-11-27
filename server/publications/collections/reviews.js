import { ProductReviews } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.publish("ProductReviews", function (productId) {
  check(productId, String);
  if (productId === "") {
    return this.ready();
  }
  return ProductReviews.find({ revieweeId: productId  });
});
