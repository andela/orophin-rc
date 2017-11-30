import React, { Component } from "react";
import PropTypes from "prop-types";
import Rater from "react-rater";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { ProductRatings } from "/lib/collections";
import { ReactionProduct } from "/lib/api";
import isGuestUser from "../util/isGuest";

class ProductRatingsComponent extends Component {
  static propTypes = {
    averageRating: PropTypes.string,
    editable: PropTypes.bool,
    hasRated: PropTypes.bool,
    raters: PropTypes.number,
    userRatings: PropTypes.array
  };

  /**
   * handle post ratings event
   * @param {object} _ref
   * @returns {*} void
   */
  postRatings = (_ref) => {
    const rating = _ref.rating;
    const type = _ref.type;
    if (type === "click") {
      const currentProduct = ReactionProduct.selectedProduct();
      const rateeId = currentProduct._id;
      const userId = Meteor.userId();
      Meteor.call("insert/ProductRatings", {
        userId,
        rateeId,
        ratingsScore: rating
      }, (error) => {
        if (error) {
          Alerts.toast(error.message, "error");
          this.forceUpdate();
        } else {
          Alerts.toast("Thank you for rating", "success");
        }
      });
    }
  };

  /**
   * handle update ratings event
   * @param {object} _ref
   * @returns {*} void
   */
  updateRatings = (_ref) => {
    const rating = _ref.rating;
    const type = _ref.type;
    if (type === "click") {
      const id = this.props.userRatings[0]._id;
      Meteor.call("update/ProductRatings",
        id,
        rating
        , (error) => {
          if (error) {
            Alerts.toast(error.message, "error");
            this.forceUpdate();
          }
        });
    }
  };

  /**
   * check if user has rated before
   * @returns {ReactElement} markup
   */
  isRated() {
    if (this.props.hasRated === false) {
      return (
        <div>
          <p>Please Rate this</p>
          <Rater
            total={5}
            onRate={this.postRatings}
          />
        </div>
      );
    }
    return (
      <div>
        <Rater
          total={5}
          rating={this.props.userRatings[0].ratingsScore}
          onRate={this.updateRatings}
        />
      </div>
    );
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    if (this.props.editable) {
      return null;
    }
    return (
      <div className="rating-container">
        <h3>Average Rating</h3>
        <div className="fa-stack rating-star-wrapper">
          <span className="fa fa-star fa-5x fa-stack-4x star" />
          <strong className="fa-stack-1x ratings">
            {this.props.averageRating}
          </strong>
        </div>
        <h6>{`Total number of ratings: ${this.props.raters}`}</h6>
        {
          !isGuestUser() &&
          <div>{this.isRated()}</div>
        }
      </div>
    );
  }
}

const composer = (props, onData) => {
  const userId = Meteor.userId();
  const rateeId = ReactionProduct.selectedProduct()._id;
  const subscription = Meteor.subscribe("ProductRatings", rateeId);
  let hasRated = false;
  let averageRating = 0;

  if (subscription.ready()) {
    let total = 0;
    const ratings = ProductRatings.find({ rateeId }).fetch();
    const userRatings = ProductRatings.find({ userId, rateeId }).fetch();
    if (userRatings.length > 0) {
      hasRated = true;
    }
    const totalRatingScore = ratings.map((rating) => {
      total += rating.ratingsScore;
    });
    const raters = ratings.length;
    if (raters < 1) {
      averageRating = "0.0";
    } else {
      averageRating = ((total / (5 * raters)) * 5).toFixed(1);
    }
    return onData(null, { raters, averageRating, hasRated, totalRatingScore, userRatings });
  }
};

registerComponent("ProductRatingsComponent", ProductRatingsComponent, composeWithTracker(composer));

export default composeWithTracker(composer)(ProductRatingsComponent);
