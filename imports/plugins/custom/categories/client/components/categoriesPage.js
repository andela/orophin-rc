import React from "react";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Products, Shops } from "/lib/collections";
import { Router } from "/client/api";
import { Session } from "meteor/session";
import { Reaction } from "/client/api";
import { applyProductRevision } from "/lib/api/products";
import ProductsComponent from "../../../../included/product-variant/components/products";
import { wrapComponent  } from "../../../../included/product-variant/containers/productsContainer";

const CATEGORIES = {
  "groceries": "GROCERIES",
  "fashion": "FASHION",
  "phone-and-tablets": "PHONE & TABLETS",
  "home-and-office": "HOME & OFFICE",
  "computing": "COMPUTING",
  "tv-and-electronics": "TV & ELECTRONICS",
  "baby-kids-and-toys": "BABY, KIDS & TOYS",
  "health-and-beauty": "HEALTH & BEAUTY",
  "watches-and-sunglasses": "WATCHES & SUNGLASSES",
  "game-and-console": "GAME & CONSOLES",
  "other": "OTHER CATEGORIES"
};

const CategoriesPage = (props) => {
  const { category } = Router.current().params;
  const Comp = wrapComponent(ProductsComponent);
  return (
    <div className="container-fluid">
      <div className="row header" style={{ height: "10vh" }}>
        <h1>{CATEGORIES[category]}</h1>
      </div>
      <Comp {...props} />
    </div>
  );
};

function composer(props, onData) {
  window.prerenderReady = false;

  let canLoadMoreProducts = false;

  const scrollLimit = Session.get("productScrollLimit");
  const category = Reaction.Router.current().params.category;
  const productsSubscription = Meteor.subscribe("Products/category", scrollLimit, CATEGORIES[category]);

  if (productsSubscription.ready()) {
    window.prerenderReady = true;
  }

  const activeShopsIds = Shops.find({
    $or: [
      { "workflow.status": "active" },
      { _id: Reaction.getPrimaryShopId() }
    ]
  }).fetch().map(activeShop => activeShop._id);

  const productCursor = Products.find({
    ancestors: [],
    type: { $in: ["simple"] },
    shopId: { $in: activeShopsIds }
  });

  const products = productCursor.map((product) => {
    return applyProductRevision(product);
  });

  canLoadMoreProducts = productCursor.count() >= Session.get("productScrollLimit");
  Session.set("productGrid/products", products);

  onData(null, {
    productsSubscription,
    products,
    canLoadMoreProducts
  });
}

registerComponent("CategoriesPage", CategoriesPage, composeWithTracker(composer));
export default composeWithTracker(composer)(CategoriesPage);
