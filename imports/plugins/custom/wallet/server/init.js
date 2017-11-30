import { Reaction, Hooks } from "/server/api";

Hooks.Events.add("afterCoreInit", () => {
  Reaction.addRolesToGroups({
    allShops: true,
    groups: ["owner"],
    roles: ["account/verify"]
  });
});


// import { Meteor } from "meteor/meteor";

// const loggedInUserId = Meteor.userId();

// console.log(loggedInUserId);

// function addRolesToVisitors() {
//   // Add the about permission to all default roles since it's available to all
//   Logger.info("::: Adding about route permissions to default roles");
//   const shop = Shops.findOne(Reaction.getShopId());
//   Shops.update(shop._id, {
//     $addToSet: { defaultVisitorRole: "about" }
//   }
//   );
//   Shops.update(shop._id, {
//     $addToSet: { defaultRoles: "about" }
//   });
// }

// /**
//  * Hook to make additional configuration changes
//  */
// Hooks.Events.add("afterCoreInit", () => {
//   addRolesToVisitors();
// });
