import { Reaction, Hooks } from "/server/api";
import { Shops } from "../../../../../lib/collections";

const addRolesToVisitors = () => {
  const shop = Shops.findOne(Reaction.getShopId());
  Shops.update(shop._id, {
    $addToSet: { defaultVisitorRole: "shop/reviews/rating" }
  }
  );
  Shops.update(shop._id, {
    $addToSet: { defaultRoles: "shop/reviews/rating" }
  });
};

Hooks.Events.add("afterCoreInit", () => {
  addRolesToVisitors();
});
