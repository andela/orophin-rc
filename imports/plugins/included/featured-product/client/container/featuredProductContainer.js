import { compose, withProps } from "recompose";
import { Media } from "/lib/collections";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import FeaturedProducts from "../component/featuredProductComponent";


const handlers = {};

handlers.handleDisplayMedia = (product) => {
  const media = Media.findOne({
    "metadata.productId": product._id,
    "metadata.toGrid": 1
  }, {
    sort: { "metadata.priority": 1, "uploadedAt": 1 }
  });

  return media instanceof FS.File ? media : false;
};

function composer(props, onData) {
  const featuredProducts = props.featuredProducts;

  if (featuredProducts.length > 0) {
    onData(null, {
      featuredProducts
    });
  } else {
    onData(null, {
      featuredProducts
    });
  }
}


registerComponent("FeaturedProducts", FeaturedProducts, [
  withProps(handlers),
  composeWithTracker(composer)
]);

export default compose(
  withProps(handlers),
  composeWithTracker(composer)
)(FeaturedProducts);
