
import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";
import { registerComponent, composeWithTracker } from "@reactioncommerce/reaction-components";
import { Session } from "meteor/session";
import { ITEMS_INCREMENT } from "/client/config/defaults";
import ProductsComponent from "../components/products";
import productsComposer from "../../../service/products";

/**
 * loadMoreProducts
 * @summary whenever #productScrollLimitLoader becomes visible, retrieve more results
 * this basically runs this:
 * Session.set('productScrollLimit', Session.get('productScrollLimit') + ITEMS_INCREMENT);
 * @return {undefined}
 */
function loadMoreProducts() {
  let threshold;
  const target = document.querySelectorAll("#productScrollLimitLoader");
  let scrollContainer = document.querySelectorAll("#container-main");
  if (scrollContainer.length === 0) {
    scrollContainer = window;
  }

  if (target.length) {
    threshold = scrollContainer[0].scrollHeight - scrollContainer[0].scrollTop === scrollContainer[0].clientHeight;

    if (threshold) {
      if (!target[0].getAttribute("visible")) {
        target[0].setAttribute("productScrollLimit", true);
        Session.set("productScrollLimit", Session.get("productScrollLimit") + ITEMS_INCREMENT || 24);
      }
    } else {
      if (target[0].getAttribute("visible")) {
        target[0].setAttribute("visible", false);
      }
    }
  }
}

export const wrapComponent = (Comp) => (
  class ProductsContainer extends Component {
    static propTypes = {
      canLoadMoreProducts: PropTypes.bool,
      products: PropTypes.array,
      productsSubscription: PropTypes.object,
      showNotFound: PropTypes.bool
    };

    constructor(props) {
      super(props);
      this.state = {
        initialLoad: true
      };

      this.ready = this.ready.bind(this);
      this.loadMoreProducts = this.loadMoreProducts.bind(this);
    }

    ready = () => {
      if (this.props.showNotFound === true) {
        return false;
      }

      const isInitialLoad = this.state.initialLoad === true;
      const isReady = this.props.productsSubscription.ready();

      if (isInitialLoad === false) {
        return true;
      }

      if (isReady) {
        return true;
      }

      return false;
    }

    loadMoreProducts = () => {
      return this.props.canLoadMoreProducts === true;
    }

    loadProducts = (event) => {
      event.preventDefault();
      this.setState({
        initialLoad: false
      });
      loadMoreProducts();
    }

    render() {
      return (
        <Comp
          ready={this.ready}
          products={this.props.products}
          productsSubscription={this.props.productsSubscription}
          loadMoreProducts={this.loadMoreProducts}
          loadProducts={this.loadProducts}
          showNotFound={this.props.showNotFound}
        />
      );
    }
  }
);

function composer(props, onData) {
  productsComposer(props, onData);
}

registerComponent("Products", ProductsComponent, [
  composeWithTracker(composer),
  wrapComponent
]);

export default compose(
  composeWithTracker(composer),
  wrapComponent
)(ProductsComponent);
