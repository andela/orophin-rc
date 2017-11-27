import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "featured-product",
  name: "reaction-featured-product",
  autoEnable: true,
  registry: [
    {
      name: "Featured Product",
      provides: ["featured-product"],
      template: "featuredProduct"
    }
  ]
});
