import { ShopReviews } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import reviewsPublisher from "./reviewsPublisher";

Meteor.publish("ShopReviews", function (shopId) {
  return reviewsPublisher(shopId, ShopReviews);
});
