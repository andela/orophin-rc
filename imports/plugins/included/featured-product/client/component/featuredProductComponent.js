import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Reaction } from "/lib/api";
import { formatPriceString } from "/client/api";

class FeaturedProducts extends Component {
  static propTypes = {
    featuredProducts: PropTypes.array,
    handleDisplayMedia: PropTypes.func
  }

  constructor() {
    super();
    this.renderMedia = this.renderMedia.bind(this);
  }

  displayPrice = (product) => {
    if (product.price && product.price.range) {
      return formatPriceString(product.price.range);
    }
    return formatPriceString(product.price);
  };

  renderMedia(product) {
    const media = this.props.handleDisplayMedia(product);
    if (media === false) {
      return (
        <img className="product-image" src="/resources/placeholder.gif" />
      );
    }
    return (
      <img className="product-image" src={`${media.url({ store: "large" })}`} />
    );
  }

  goToProductPage(product) {
    const { handle } = product;
    return Reaction.Router.go("product", {
      handle: handle
    });
  }

  render() {
    const { featuredProducts } = this.props;
    const featuredProductsGroup = _.chunk(featuredProducts, 4);
    if (!featuredProducts.length) {
      return (
        <div> No products yet</div>
      );
    }
    return (
      <div>
        <h2 className="featured-section hidden-xs">Featured Products</h2>
        <div className="tcb-product-slider hidden-xs">
          <div id="carousel-example-generic"
            className="carousel slide featured-slide"
            data-ride="carousel"
          >
            <div className="carousel-inner"
              role="listbox"
            >
              {
                featuredProductsGroup.map((group, index) => {
                  return (
                    <div key={index} className={`item ${ (index === 0) ? "active" : ""}`}>
                      <div className="container">
                        <div className="row feature-size">
                          {
                            group.map((product) => {
                              return (
                                <div key={product._id}>
                                  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                    <div className="item-content col-background">
                                      <div className="hovereffect feature-hov product-primary-images"
                                        onClick={() => this.goToProductPage(product)}
                                      >
                                        {this.renderMedia(product)}
                                      </div>
                                      <a>
                                        <div className="ellipsis">
                                          <h4 className="overlay-title ellipsis text-center"
                                            onClick={() => this.goToProductPage(product)}
                                          >
                                            {product.title}
                                          </h4>
                                        </div>
                                      </a>
                                      <p className="currency-symbol text-center">
                                        {this.displayPrice(product)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          }
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <a className="left carousel-control"
              href="#carousel-example-generic"
              role="button" data-slide="prev"
            >
              <span className="fa fa-chevron-left arrow"
                aria-hidden="true"
              />
              <span className="sr-only">Previous</span>
            </a>
            <a className="right carousel-control"
              href="#carousel-example-generic"
              role="button" data-slide="next"
            >
              <span className="fa fa-chevron-right arrow"
                aria-hidden="true"
              />
              <span className="sr-only">Next</span>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default FeaturedProducts;
