import PropTypes from "prop-types";
import { registerComponent, composeWithTracker, Components } from "@reactioncommerce/reaction-components";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { ProductReviews } from "/lib/collections";
import { ReactionProduct } from "/lib/api";

class ProductReviewsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: "",
      name: Meteor.user().name || "Guest"
    };
    this.productId = ReactionProduct.selectedProduct()._id;
    this.reviewer = {
      id: Meteor.userId(),
      name: this.state.name
    };
  }
  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handlePostReview = (event) => {
    const { content } = this.state;
    event.preventDefault();
    Meteor.call("insert/ProductReviews", {
      reviewer: JSON.stringify(this.reviewer),
      revieweeId: this.productId,
      content
    }, (error) => {
      if (error) {
        Alerts.toast(error.message, "error");
        this.forceUpdate();
      } else {
        Alerts.toast("Operation Successful", "success");
        this.setState({ content: "" });
      }
    });
  };
  handleDeleteReview = () => {
    console.log(typeof this.productId, typeof this.reviewer);
    const currentProduct = ReactionProduct.selectedProduct();
    const productId = currentProduct._id;
    Meteor.call("delete/ProductReviews", productId, JSON.stringify(this.reviewer), (error) => {
      if (error) {
        Alerts.toast(error.message, "error");
        this.forceUpdate();
      } else {
        Alerts.toast("Operation Successful", "success");
      }
    });
  };
  toTimeAndDate = (time) => {
    const date = new Date(time);
    const dateArray = date.toLocaleString().split(" ");
    const timeArray = dateArray[1].split(":");
    if (dateArray.length > 2 && timeArray.length > 2) {
      return {
        date: dateArray[0],
        time: `${timeArray[0]}:${timeArray[1]}${dateArray[2].toLowerCase()}`
      };
    }
  }
  renderReviews = (props) => {
    const { ReactionAvatar } = Components;
    let postedByUSer;
    let {
      content,
      createdAt,
      reviewer
    } = props.review;
    if (reviewer) {
      reviewer = JSON.parse(`${reviewer}`);
      postedByUSer = Meteor.userId() === reviewer.id;
    }
    return (
      <li className="review">
        <ReactionAvatar name={reviewer.name} size={50} />
        <div className="review-content">
          <div className="review-header">
            <h6>{reviewer.name}</h6>
            <span>{this.toTimeAndDate(createdAt).time}</span>
          </div>
          <div className="review-body">
            {content}
          </div>
          { postedByUSer &&
            <div className="d-flex review-icon-wrapper">
              <i className="fa fa-pencil" />
              <i className="fa fa-trash" onClick={this.handleDeleteReview} />
            </div>
          }
        </div>
      </li>
    );
  };
  render() {
    const { content, name } = this.state;
    const { reviews } = this.props;
    const { Button } = Components;
    const Comp = this.renderReviews;
    return (
      <div className="review-section">
        <form onSubmit={this.handlePostReview} className="col-12">
          <div className="form-group">
            <input
              className="form-control rui textfield input "
              name="name"
              onChange={this.handleChange}
              value={name}
              required
              type="text"
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-control rui textfield input"
              name="content"
              rows="3"
              onChange={this.handleChange}
              value={content}
              required
              placeholder="Enter your review"
            />
          </div>
          <br />
          <div>
            <Button
              type="submit"
              className="btn review-btn"
            >
            Post Review
            </Button>
          </div>
        </form>
        <ul className="row review-list">
          {reviews.map((review) => {
            return (<Comp review={review} key={review._id}/>);
          })}
        </ul>
      </div>
    );
  }
}
ProductReviewsComponent.propTypes = {
  content: PropTypes.string,
  createdAt: PropTypes.string,
  reviews: PropTypes.arrayOf(PropTypes.object)
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
