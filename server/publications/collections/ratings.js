import { Ratings } from "/lib/collections";
import { Meteor } from "meteor/meteor";

Meteor.publish("Ratings", function () {
  let total = 0;
  Ratings.find({
    productId: this.productId
  }).map(function (doc) {
    total += doc.ratingsScore;
  });
  return total;
});
