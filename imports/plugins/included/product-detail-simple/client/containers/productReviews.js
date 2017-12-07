import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { ProductReviews } from "/lib/collections";
import { ReactionProduct } from "/lib/api";
import { ReviewsComponent } from "../components";

class ProductReviewsComponent extends Component {
  constructor(props) {
    super(props);
    this.productId = ReactionProduct.selectedProduct()._id;
  }

  render() {
    return (
      <ReviewsComponent
        reviews={this.props.reviews}
        collectionName="ProductReviews"
        revieweeId={this.productId}
        editable={this.props.editable}
        revieweeName={"product"}
      />
    );
  }
}
ProductReviewsComponent.propTypes = {
  collectionName: PropTypes.string,
  editable: PropTypes.bool,
  revieweeName: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.object),
  reviweeeId: PropTypes.string
};
const composer = (props, onData) => {
  const productId = ReactionProduct.selectedProduct()._id;
  const subscription = Meteor.subscribe("ProductReviews", productId);
  if (subscription.ready()) {
    const reviews = ProductReviews.find({ revieweeId: productId }).fetch();
    return onData(null, { reviews: reviews.reverse() });
  }
};

registerComponent("ProductReviewsComponent", ProductReviewsComponent, composeWithTracker(composer));

export default composeWithTracker(composer)(ProductReviewsComponent);

