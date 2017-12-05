import React from "react";
import { Components, registerComponent } from "@reactioncommerce/reaction-components";

const PriceRange = (props) => {
  return (
    <div className="pdp price-range">
      <Components.Currency {...props} />
      <div
        className="pull-right fb-share-button socials" data-href="https://www.facebook.com/reactioncommerce/" data-layout="button_count"
        data-size="small" data-mobile-iframe="true"
      >
        <a
          className="fb-xfbml-parse-ignore social-icons" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2Freactioncommerce%2F&amp;src=sdkpreparse" rel="noopener noreferrer"
        ><i className="fa fa-facebook" />
        </a>
        <a
          className="twitter-share-button social-icons" target="_blank" href="https://twitter.com/share?ref_src=twsrc%5Etfw"rel="noopener noreferrer"
          data-show-count="false"
        ><i className="fa fa-twitter" />
        </a>
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" />
      </div>
    </div>
  );
};

registerComponent("PriceRange", PriceRange);

export default PriceRange;
