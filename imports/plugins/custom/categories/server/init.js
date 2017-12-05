import { Reaction, Hooks } from "/server/api";
import { Shops } from "../../../../../lib/collections";

const addRolesToVisitors = () => {
  const shop = Shops.findOne(Reaction.getShopId());
  Shops.update(shop._id, {
    $addToSet: { defaultVisitorRole: "products/category" }
  }
  );
  Shops.update(shop._id, {
    $addToSet: { defaultRoles: "products/category" }
  });
};

Hooks.Events.add("afterCoreInit", () => {
  addRolesToVisitors();
});
