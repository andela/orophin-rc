import React from "react";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Router } from "/client/api";
import { Reaction } from "/client/api";
import ProductsComponent from "../../../../included/product-variant/components/products";
import { wrapComponent  } from "../../../../included/product-variant/containers/productsContainer";
import productsComposer from "../../../../service/products";

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
  const category = Reaction.Router.getParam("category");
  productsComposer(props, onData, CATEGORIES[category]);
}

registerComponent("CategoriesPage", CategoriesPage, composeWithTracker(composer));
export default composeWithTracker(composer)(CategoriesPage);
