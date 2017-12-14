import { Reaction } from "/server/api";

Reaction.registerPackage({
  icon: "fa fa-bell",
  label: "category",
  name: "categories",
  autoEnable: true,
  registry: [{
    label: "categories",
    name: "productsCategory",
    route: "/products/:category",
    workflow: "coreProductWorkflow",
    permissions: [{
      label: "products/category",
      permission: "products/category"
    }],
    template: "categoriesPage"
  }]
});
