import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "footer",
  name: "reaction-footer",
  autoEnable: true,
  registry: [
    {
      name: "footer",
      provides: ["footer"],
      template: "footer"
    }
  ]
});
