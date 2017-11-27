import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import  ShopReviewsComponent from "./shopReview";
import ShopRatingsComponent from "./shopRatings";
import { Reaction } from "/client/api";

const ShopRatingAndReview = () => {
  return (
    <div className="container-fluid">
      <div className="row header">
        <h1>{`Rating and reviews  for ${Reaction.getShopName()}`}</h1>
        <ShopRatingsComponent/>
      </div>
      <div className="row reviews-wrapper">
        <ShopReviewsComponent />
      </div>
    </div>
  );
};

registerComponent("ShopRatingAndReview", ShopRatingAndReview);
export default ShopRatingAndReview;
