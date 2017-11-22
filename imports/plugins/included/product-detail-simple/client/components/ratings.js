import React from "react";
import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";

const Ratings = ({ averageRating }) => {
  return (
    <div>
      <span className="fa-stack">
        <span className="fa fa-star-o fa-5x fa-stack-4x" />
        <strong className="fa-stack-1x">
          {averageRating}
        </strong>
      </span>
    </div>
  );
};

Ratings.propTypes = {
  averageRating: PropTypes.number
};

registerComponent("Ratings", Ratings);

export default Ratings;
