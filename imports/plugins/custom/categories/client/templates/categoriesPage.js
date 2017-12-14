import { Template } from "meteor/templating";
import { Components } from "@reactioncommerce/reaction-components";

Template.categoriesPage.helpers({
  categoriesPage() {
    return Components.CategoriesPage;
  }
});
