import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "categories",
  name: "categories",
  autoEnable: true,
  registry: [
    {
      name: "categories",
      provides: ["categories"],
      template: "categories"
    }
  ]
});
