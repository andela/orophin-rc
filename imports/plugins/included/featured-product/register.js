import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "featured-product",
  name: "reaction-featured-product",
  autoEnable: true,
  registry: [{
    route: "/featured/:handle/:variantId?",
    name: "featured",
    template: "productDetailSimple",
    workflow: "coreProductWorkflow"
  }],
  layout: [{
    layout: "coreLayout",
    workflow: "coreProductWorkflow",
    collection: "Products",
    theme: "default",
    enabled: true,
    structure: {
      template: "productDetailSimple",
      layoutHeader: "layoutHeader",
      layoutFooter: "",
      notFound: "productNotFound",
      dashboardHeader: "productDetailSimpleToolbar",
      dashboardControls: "productDetailDashboardControls",
      dashboardHeaderControls: "",
      adminControlsFooter: "adminControlsFooter"
    }
  }]
});
