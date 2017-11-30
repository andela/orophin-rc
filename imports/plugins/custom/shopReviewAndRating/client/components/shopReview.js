import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { ShopReviews } from "/lib/collections";
import { Reaction } from "/lib/api";
import { ReviewsComponent } from "../../../../included/product-detail-simple/client/components";

class ShopReviewsComponent extends Component {
  render() {
    return (
      <ReviewsComponent
        reviews={this.props.reviews}
        collectionName="ShopReviews"
        revieweeId={Reaction.getShopId()}
        editable={this.props.editable}
        revieweeName={"shop"}
        center
      />
    );
  }
}
ShopReviewsComponent.propTypes = {
  collectionName: PropTypes.string,
  editable: PropTypes.bool,
  revieweeName: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.object),
  reviweeeId: PropTypes.string
};
const composer = (props, onData) => {
  const shopId = Reaction.getShopId();
  const subscription = Meteor.subscribe("ShopReviews", shopId);
  if (subscription.ready()) {
    const reviews = ShopReviews.find({ revieweeId: shopId }).fetch();
    return onData(null, { reviews: reviews.reverse() });
  }
};

registerComponent("ShopReviewsComponent", ShopReviewsComponent, composeWithTracker(composer));

export default composeWithTracker(composer)(ShopReviewsComponent);

