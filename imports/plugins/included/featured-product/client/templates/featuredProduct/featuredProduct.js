import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import FeaturedProductContainer from "../../container/featuredProductContainer";
import * as Collections from  "/lib/collections";

/*
 * featuredProduct helpers
 */
Template.featuredProduct.helpers({
  // Returns React Component
  featuredProducts() {
    const shopSub = Meteor.subscribe("Products");
    let featuredProducts = [];
    if (shopSub.ready()) {
      featuredProducts = Collections.Products.find({
        $where: function () {
          return (this.handle !== undefined);
        } },
      {
        limit: 8
      }).fetch();
    }
    return { component: FeaturedProductContainer,
      featuredProducts
    };
  }
});
