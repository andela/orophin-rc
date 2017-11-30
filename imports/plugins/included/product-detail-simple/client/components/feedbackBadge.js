import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Reaction } from "/lib/api";
import { Meteor } from "meteor/meteor";
import { ShopRatings } from "/lib/collections";

class FeedbackBadge extends Component {
  static propTypes = {
    averageRating: PropTypes.string,
    editable: PropTypes.bool,
    raters: PropTypes.number,
    userRatings: PropTypes.array
  };

viewShopReviews = (e) => {
  e.preventDefault();
  const shopName = Reaction.getShopName();
  Reaction.Router.go("shopReviewRating", {
    shopName
  });
};

  /**
   * render
   * @return {ReactElement} markup
   */
render() {
  return (
    <div className="feedback-badge">
      <h6>Shop Rating</h6>
      <div className="fa-stack rating-star-wrapper shop-star-wrapper">
        <span className="fa fa-star fa-5x fa-stack-4x star" />
        <strong className="fa-stack-1x ratings">
          {this.props.averageRating}
        </strong>
      </div>
      <a onClick={this.viewShopReviews}>See shop reviews</a>
    </div>
  );
}
}

const composer = (props, onData) => {
  const userId = Meteor.userId();
  const shopId = Reaction.getShopId();
  const subscription = Meteor.subscribe("ShopRatings", shopId);
  let averageRating = 0;

  if (subscription.ready()) {
    let total = 0;
    const ratings = ShopRatings.find({ rateeId: shopId }).fetch();
    const userRatings = ShopRatings.find({ userId, rateeId: shopId }).fetch();
    const totalRatingScore = ratings.map((rating) => {
      total += rating.ratingsScore;
    });
    const raters = ratings.length;
    if (raters < 1) {
      averageRating = "0.0";
    } else {
      averageRating = ((total / (5 * raters)) * 5).toFixed(1);
    }
    return onData(null, { raters, averageRating, totalRatingScore, userRatings, shopId });
  }
};

registerComponent("FeedbackBadge", FeedbackBadge, composeWithTracker(composer));

export default composeWithTracker(composer)(FeedbackBadge);
