import { Reviews } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.publish("ProductReviews", function (productId) {
  check(productId, String);
  return Reviews.findOne({ revieweeId: productId  });
});
