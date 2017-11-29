import { introJs } from "intro.js";
import { Reaction } from "/client/api";

const intro = introJs();
const shopperTour = [
  {
    intro: `<h2>Welcome to Reation Commerce</h2>
        <hr>
        <div>Hello and welcome to Reaction Commerce. Join me on this quick tour and Let's show you around in the next few steps</div>`
  },
  {
    element: ".product-grid",
    intro: `<h2>Products Gallery</h2>
        <hr>
        <div> Browse through our gallery of available products and add the products you'll like to purchase to your cart</div>`
  },
  {
    element: ".cart-container",
    intro: `<h2> Shopping Cart </h2>
        <hr>
        <div> Your shopping cart contains all the products that you selected for purchase. Click on this icon to proceed to checkout</div>`
  },
  {
    element: ".accounts",
    intro: `<h2> User Account Options</h2>
        <hr>
        <div>Access user account options. Register, signin or signout here</div>`
  },
  {
    element: ".currencies",
    intro: `<h2> Currency Options</h2>
        <hr>
        <div> Select your prefered currency for making payment</div>`
  },
  {
    element: ".languages",
    intro: `<h2> Language Options</h2>
        <hr>
        <div> Select your prefered language by clicking on this button </div>`
  },
  {
    element: ".search",
    intro: `<h2>Search Products</h2>
        <hr>
        <div> Find specific products on our platform with ease by clicking on this button and entering your search keyword</div>`
  },
  {
    intro: `<h2>End of Tour</h2>
        <hr>
        <div>That's it. Hope the tour was helpful? Why not get started with shopping.</div>`
  }
];

const vendorTour = [
  {
    intro: `<h2>Welcome to Reation Commerce</h2>
          <hr>
          <div>You seem to be new here...Let's onboard you unto the platform in the next few steps</div>`
  },
  {
    element: ".product-grid",
    intro: `<h2>Products Gallery</h2>
          <hr>
          <div> Browse through our gallery of available products, click on any product to view its details and add to your cart</div>`
  },
  {
    element: ".toolbar-vertical",
    intro: `<h2>Vendor Dashboard</h2>
            <hr>
            <div>Manage your store from this section. Attend to Orders, choose your preferred payment methods etc.</div>`
  },
  {
    element: ".cart-container",
    intro: `<h2> Shopping Cart </h2>
          <hr>
          <div> Your shopping cart contains all the products that you selected for purchase. Click on this icon to proceed to checkout</div>`
  },
  {
    element: ".accounts",
    intro: `<h2> User Account Options</h2>
          <hr>
          <div>Access user account options. Register, signin or signout here</div>`
  },
  {
    element: ".currencies",
    intro: `<h2> Currency Options</h2>
          <hr>
          <div> Select your prefered currency for making payment</div>`
  },
  {
    element: ".languages",
    intro: `<h2> Language Options</h2>
          <hr>
          <div> Select your prefered language by clicking on this button </div>`
  },
  {
    element: ".search",
    intro: `<h2>Search Products</h2>
          <hr>
          <div> To search for specific products on our platform click on this button and enter your search keyword</div>`
  },
  {
    element: "nav.rui",
    intro: `<h2> Toolbar</h2>
          <hr>
          <div> Carry out admin operations like adding, editing and viewing products from this section</div>`
  },
  {
    element: ".left",
    intro: `<h2> Toggle Modes</h2>
          <hr>
          <div> Toggle between edit and view mode to make and view changes to your shop</div>`
  },
  {
    intro: `<h2>End of Tour</h2>
          <hr>
          <div>Thanks for joining me on the tour. Hope you're ready to get started? </div>`
  }
];

export default () => {
  let tourSteps;
  if (Reaction.hasPermission("admin")) {
    tourSteps = vendorTour;
  } else {
    tourSteps = shopperTour;
  }
  intro.setOptions({
    showBullets: true,
    showProgress: true,
    scrollToElement: true,
    showStepNumbers: false,
    steps: tourSteps
  });
  intro.start();
};
