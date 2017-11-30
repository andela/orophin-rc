import { Reaction } from "/server/api";

Reaction.registerPackage({
  icon: "fa fa-bell",
  label: "Shop details",
  name: "product",
  autoEnable: true,
  registry: [{
    label: "ShopReviewAndRating",
    name: "shopReviewRating",
    route: "/rating-reviews/:shopName",
    workflow: "coreProductWorkflow",
    permissions: [{
      label: "shop/ratings/review",
      permission: "shop/ratings/review"
    }],
    template: "shopRatingAndReview"
  }]
});
