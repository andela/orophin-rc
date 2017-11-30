import { ProductReviews } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import reviewsPublisher from "./reviewsPublisher";

Meteor.publish("ProductReviews", function (productId) {
  return reviewsPublisher(productId, ProductReviews);
});
