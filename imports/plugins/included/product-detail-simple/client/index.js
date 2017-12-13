import "./templates/productDetailSimple.html";
import "./templates/productDetailSimple.js";
import { registerComponent } from "@reactioncommerce/reaction-components";

import {
  ProductField,
  ProductTags,
  ProductMetadata,
  PriceRange,
  AddToCartButton,
  ProductNotFound,
  ProductDetail,
  ProductRatingsComponent,
  FeedbackBadge,
  DigitalProduct,
  Footer
} from "./components";

import {
  Divider
} from "/imports/plugins/core/ui/client/components";

import {
  SocialContainer,
  VariantListContainer,
  ProductReviewsComponent
} from "./containers";

import {
  Alerts,
  MediaGalleryContainer
} from "/imports/plugins/core/ui/client/containers";


// Register PDP components and some others
registerComponent("productDetail", ProductDetail);
registerComponent("ProductField", ProductField);
registerComponent("ProductTags", ProductTags);
registerComponent("ProductMetadata", ProductMetadata);
registerComponent("PriceRange", PriceRange);
registerComponent("AlertContainer", Alerts);
registerComponent("MediaGalleryContainer", MediaGalleryContainer);
registerComponent("SocialContainer", SocialContainer);
registerComponent("VariantListContainer", VariantListContainer);
registerComponent("AddToCartButton", AddToCartButton);
registerComponent("Divider", Divider);
registerComponent("ProductNotFound", ProductNotFound);
registerComponent("Reviews", ProductReviewsComponent);
registerComponent("Ratings", ProductRatingsComponent);
registerComponent("FeedbackBadge", FeedbackBadge);
registerComponent("DigitalProduct", DigitalProduct);
registerComponent("Footer", Footer);

