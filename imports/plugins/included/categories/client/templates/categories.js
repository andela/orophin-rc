import { Template } from "meteor/templating";
import { Components } from "@reactioncommerce/reaction-components";

Template.categories.helpers({
  categories() {
    return Components.Categories;
  }
});
