import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { ReactionProduct } from "/lib/api";
import { registerComponent } from "@reactioncommerce/reaction-components";

class Review extends Component {
  constructor(props) {
    super(props);
    reviewMessage: "";
  }

  handleOnChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handlePostReview = (event) => {
    event.preventDefault();
    const currentProduct = ReactionProduct.selectedProduct();
    const productId = currentProduct._id;
    const userId = Meteor.userId;
    Meteor.call("reviews/postReview", userId, productId.Id, this.state.reviewMessage, (error) => {
      if (error) {
        Alerts.toast(error.message, "error");
        this.forceUpdate();
      }
    });
  };
  render() {
    return (
      <div>
        <section>
          <div>
            <textarea
              className="form-control form-rounded"
              name="reviewMessage"
              rows="1"
              onChange={this.handleChange}
              required
            />
          </div>
          <br />
          <div>
            <button
              type="button"
              className="btn btn-success"
              onClick={this.handlePostReview}
            >Add Review
            </button>
          </div>
        </section>
        <div className="panel panel-white post panel-shadow">
          <div className="post-heading">
            <div className="pull-left image">
              <img
                src="http://bootdey.com/img/Content/user_1.jpg"
                className="rounded-circle avatar"
                alt="User"
              />
            </div>
            <div className="pull-left meta">
              <div className="title h5">
                <p><b>Johnny <small>posted a review</small></b></p>
              </div>
              <h6 className="text-muted time">2017-11-23</h6>
            </div>
          </div>
          <div className="post-description">
            <p>Nice and cool</p>
          </div>
        </div>
      </div>
    );
  }
}

registerComponent("Review", Review);

export default Review;
