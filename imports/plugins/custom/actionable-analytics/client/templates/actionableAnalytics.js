import { Template } from "meteor/templating";
import { Components } from "@reactioncommerce/reaction-components";

Template.actionableAnalytics.helpers({
  actionableAnalytics() {
    return Components.ActionableAnalytics;
  }
});
