import { Template } from "meteor/templating";
import { Components } from "@reactioncommerce/reaction-components";

Template.shopRatingAndReview.helpers({
  shopRatingAndReview() {
    return Components.ShopRatingAndReview;
  }
});
