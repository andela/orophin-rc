import React from "react";
import PropTypes from "prop-types";
import Rater from "react-rater";
import { registerComponent } from "@reactioncommerce/reaction-components";

const ProductRatings = ({ averageRating, totalRaters }) => {
  return (
    <div className="rating-container">
      <div className="fa-stack rating-star-wrapper">
        <span className="fa fa-star fa-5x fa-stack-4x star" />
        <strong className="fa-stack-1x ratings">
          {averageRating}
        </strong>
      </div>
      <p>{`Total number of rates: ${totalRaters}`}</p>
      <Rater
        total={5}
        rating={averageRating}
        interactive={false}
      />
      <div>
        <button type="button" className="btn ratings-btn">Add Review</button>
      </div>
    </div>
  );
};

ProductRatings.propTypes = {
  averageRating: PropTypes.number,
  totalRaters: PropTypes.number
};

registerComponent("ProductRatings", ProductRatings);

export default ProductRatings;
