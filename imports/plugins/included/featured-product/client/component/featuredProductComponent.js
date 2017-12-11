import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import _ from "lodash";
import { $ } from "meteor/jquery";
import { Components } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { ReactionProduct } from "/lib/api";
import { Reaction, i18next, Logger } from "/client/api";
import { formatPriceString } from "/client/api";

class FeaturedProducts extends Component {
  static propTypes = {
    featuredProducts: PropTypes.array,
    handleDisplayMedia: PropTypes.func,
    openModal: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      productId: "",
      productClick: 0,
      variant: {}
    };
    this.renderMedia = this.renderMedia.bind(this);
  }

  openModal = (product) => {
    this.setState({
      modalIsOpen: true,
      productId: product._id
    });
  }

  handleSlideOut(alertWidth, direction, oppositeDirection) {
    // Animate slide out
    return $(".cart-alert")
      .show()
      .css({
        [oppositeDirection]: "auto",
        [direction]: -alertWidth
      })
      .animate({
        [oppositeDirection]: "auto",
        [direction]: 0
      }, 600);
  }

  handleSlideIn(alertWidth, direction, oppositeDirection) {
    // Animate slide in
    return $(".cart-alert").animate({
      [oppositeDirection]: "auto",
      [direction]: -alertWidth
    }, {
      duration: 600,
      complete() {
        $(".cart-alert").hide();
      }
    });
  }

  afterOpenModal = () => {
    this.modalTitle.style.color = "##fe7922";
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  selectVariant = (variant) => {
    this.setState({ variant });
  }
  handleCart = () => {
    const { productId, variant } = this.state;
    if (productId && variant._id) {
      Meteor.call("cart/addToCart", this.state.productId, variant._id, 1, (error) => {
        if (error) {
          Logger.error(error, "Failed to add to cart.");
          return error;
        }

        this.setState(({ productClick }) => ({
          modalIsOpen: false,
          productClick: productClick + 1
        }));

        return true;
      });
    }
    // template.$(".variant-select-option").removeClass("active");
    ReactionProduct.setCurrentVariant(null);
    // qtyField.val(1);
    // scroll to top on cart add
    $("html,body").animate({
      scrollTop: 0
    }, 0);
    // slide out label
    const addToCartText = i18next.t("productDetail.addedToCart");
    const addToCartTitle = variant.title || "";
    // Grab and cache the width of the alert to be used in animation
    const alertWidth = $(".cart-alert").width();
    const direction = i18next.dir() === "rtl" ? "left" : "right";
    const oppositeDirection = i18next.dir() === "rtl" ? "right" : "left";
    if ($(".cart-alert").css("display") === "none") {
      $("#spin").addClass("hidden");
      $(".cart-alert-text").text(`${1} ${addToCartTitle} ${addToCartText}`);
      this.handleSlideOut(alertWidth, direction, oppositeDirection);
      this.animationTimeOut = setTimeout(() => {
        this.handleSlideIn(alertWidth, direction, oppositeDirection);
      }, 4000);
    } else {
      clearTimeout(this.textTimeOut);

      // hides text and display spinner
      $(".cart-alert-text").hide();
      $("#spin").removeClass("hidden");

      this.textTimeOut = setTimeout(() => {
        $("#spin").addClass("hidden");
        $(".cart-alert-text").text(`${this.state.productClick * 1} ${addToCartTitle} ${addToCartText}`);
        $(".cart-alert-text").fadeIn("slow");
        this.setState({ productClick: 0 });
      }, 2000);

      clearTimeout(this.animationTimeOut);
      this.animationTimeOut = setTimeout(() => {
        this.handleSlideIn(alertWidth, direction, oppositeDirection);
      }, 4000);
    }
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
        <div>
          <img className="product-image" src="/resources/placeholder.gif" />
          <div className="image-overlay">
            <div
              className="overlay-circle"
              onClick={() => this.openModal(product)}
            >
              <i className="fa fa-shopping-cart fa-2x" />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <img className="product-image" src={`${media.url({ store: "large" })}`} />
        <div className="image-overlay">
          <div
            className="overlay-circle"
            onClick={this.openModal}
          >
            <i className="fa fa-shopping-cart fa-2x" />
          </div>
        </div>
      </div>
    );
  }

  goToProductPage(product) {
    const { handle } = product;
    return Reaction.Router.go("product", {
      handle: handle
    });
  }

  render() {
    const { Button } = Components;
    const variants = ReactionProduct.getVariants(this.state.productId);
    const { featuredProducts } = this.props;
    const featuredProductsGroup = _.chunk(featuredProducts, 4);
    if (!featuredProducts.length) {
      return (
        <div> No products yet</div>
      );
    }
    const customStyles = {
      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.75)"
      },
      content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)"
      }
    };
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
                                      <div className="hovereffect feature-hov product-primary-images">
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
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
          ariaHideApp={false}
        >
          <div className="modal-header title">
            <h4 className="modal-title" id="myModalLabel" ref={modalTitle => this.modalTitle = modalTitle}>Select Variant</h4>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={this.closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <h6>Please select variant for the product</h6>
            <div>
              {
                variants.map(item => (
                  <button
                    className="modal-variant-list"
                    key={item._id}
                    onClick={() => this.selectVariant(item)}
                  >{item.title}
                  </button>
                ))
              }
            </div>
          </div>
          <div className="modal-footer">
            <Button
              className="btn-color"
              onClick={this.handleCart}
            > Add To Cart
            </Button>
            <Button
              className="btn-color"
              onClick={this.closeModal}
            > Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
export default FeaturedProducts;
