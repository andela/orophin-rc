import { Meteor } from "meteor/meteor";

const isGuestUser = () => {
  const rolesKey = Object.keys(Meteor.user().roles)[0];
  const roles = Meteor.user().roles[rolesKey];
  return roles.includes("anonymous");
};

export default isGuestUser;
