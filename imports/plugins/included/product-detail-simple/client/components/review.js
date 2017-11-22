import React from "react";
import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";

const Review = ({ username, createdAt, message }) => {
  return (
    <div>
      <section>
        <div>
          <textarea
            className="form-control form-rounded"
            name="reviewMessage"
            rows="1"
            required
          />
        </div>
        <br />
        <div>
          <button type="button" className="btn btn-success">Add Review</button>
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
              <p><b>{username} <small>posted a review</small></b></p>
            </div>
            <h6 className="text-muted time">{createdAt}</h6>
          </div>
        </div>
        <div className="post-description">
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

Review.propTypes = {
  createdAt: PropTypes.string,
  message: PropTypes.string,
  username: PropTypes.string
};

registerComponent("Review", Review);

export default Review;
