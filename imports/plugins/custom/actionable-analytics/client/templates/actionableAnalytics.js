import { Template } from "meteor/templating";
import AnalyticsComponent from "../container/analyticsSubscriptions";

Template.actionableAnalytics.helpers({
  actionableAnalytics() {
    return {
      component: AnalyticsComponent
    };
  }
});
