import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Advertise UI",
  name: "reaction-ui-advertise",
  autoEnable: true,
  registry: [
    {
      name: "Adverise Carosek",
      provides: ["ui-advertise"],
      template: "advertiseCarousel"
    }
  ]
});
