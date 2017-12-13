import React, { Component } from "react";
import PropTypes from "prop-types";
import { $ } from "meteor/jquery";
import { Components } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { ReactionProduct } from "/lib/api";
import { Reaction, i18next, Logger } from "/client/api";
import startTour  from "../../tour/takeTour";
import Modal from "react-modal";

class ProductGrid extends Component {
  static propTypes = {
    products: PropTypes.array,
    storedCart: PropTypes.object
  }

  constructor() {
    super();

    this.animationTimeOut = null;
    this.textTimeOut = null;

    this.state = {
      modalIsOpen: false,
      productId: "",
      productClick: 0,
      variant: {}
    };
  }

  componentDidMount() {
    const hasTakenGuestTour = localStorage.getItem("hasTakenGuestTour");
    const hasTakenVendorTour = localStorage.getItem("hasTakenVendorTour");
    if (!hasTakenGuestTour && !Reaction.hasPermission("admin")) {
      localStorage.setItem("hasTakenGuestTour", true);
      startTour();
    }
    if (!hasTakenVendorTour && Reaction.hasPermission("admin")) {
      localStorage.setItem("hasTakenVendorTour", true);
      startTour();
    }
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

  renderProductGridItems = (products) => {
    if (Array.isArray(products)) {
      return products.map((product, index) => {
        return (
          <Components.ProductGridItems
            {...this.props}
            openModal={this.openModal}
            product={product} key={index} index={index}
          />
        );
      });
    }
    return (
      <div className="row">
        <div className="text-center">
          <h3>
            <Components.Translation defaultValue="No Products Found" i18nKey="app.noProductsFound" />
          </h3>
        </div>
      </div>
    );
  }

  openModal = (open, productId) => {
    this.setState({
      modalIsOpen: open,
      productId
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

  render() {
    const { Button } = Components;
    const variants = ReactionProduct.getVariants(this.state.productId);
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
      <div className="container-main">
        <div className="product-grid">
          <Components.DragDropProvider>
            <ul className="product-grid-list list-unstyled" id="product-grid-list">
              {this.renderProductGridItems(this.props.products)}
            </ul>
          </Components.DragDropProvider>
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

export default ProductGrid;
