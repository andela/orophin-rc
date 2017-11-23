import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Reviews } from "/lib/collections";
import { ReactionProduct } from "/lib/api";

class ProductReviews extends Component {
  constructor(props) {
    super(props);
    content: "";
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handlePostReview = (event) => {
    event.preventDefault();
    const currentProduct = ReactionProduct.selectedProduct();
    const productId = currentProduct._id;
    const userId = Meteor.userId;

    Meteor.call("insert/Reviews", {
      reviwerId: userId,
      revieweeId: productId,
      content: this.state.content
    }, (error) => {
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
              name="content"
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

ProductReviews.propTypes = {
  createdAt: PropTypes.string,
  message: PropTypes.string,
  username: PropTypes.string
};

registerComponent("ProductReviews", ProductReviews);

export default ProductReviews;
