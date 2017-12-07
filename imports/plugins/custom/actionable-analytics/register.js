import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Actionable Analysis",
  name: "actionableAnalytics",
  autoEnable: true,
  registry: [{
    label: "Actionable Analysis",
    name: "actionableAnalytics",
    route: "/analysis",
    workflow: "coreProductWorkflow",
    permissions: [{
      label: "actionableAnalytics",
      permission: "actionableAnalytics"
    }],
    template: "actionableAnalytics"
  }]
});
