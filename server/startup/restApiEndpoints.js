import collections from "../../lib/collections";
import Reaction from "/server/api/core";


/**
 *
 * @param {object} user
 * @param {string} role
 * @returns {boolean}
 */
const hasPermission = (user, role) => {
  return user.roles[Reaction.getShopId()].includes(role);
};

const Api = new Restivus({
  apiPath: "api",
  useDefaultAuth: true,
  prettyJson: true,
  version: "v1",
  defaultHeaders: {
    "Content-Type": "application/json"
  }
});
/**
 *
 *
 * @param {String} collectionName -Name of collection
 * @param {Object} collection - collection Schema
 * @param {Object} restivus object
 * @returns none
 */
function creatRestApiFor(collectionName, collection, restApi = Api) {
  restApi.addCollection(collection, {
    routeOptins: { authRequired: true },
    endpoints: {
      getAll: {
        authRequired: true,
        action() {
          if (hasPermission(this.user, "admin")
            || hasPermission(this.user, "guest")
            || hasPermission(this.user, "owner")) {
            const all = collection.find().fetch();
            if (!all) {
              return {
                status: "failed",
                statusCode: 404,
                message: `No ${collectionName} found!`
              };
            }
            return {
              status: "success",
              statusCode: 200,
              data: {
                collectionName: all
              }
            };
          }
          return {
            statusCode: 403, status: "failed",
            message: "You do not have permission to add a record"
          };
        }
      },
      post: {
        authRequired: true,
        action() {
          if (hasPermission(this.user, "admin")
            || hasPermission(this.user, "owner")) {
            let error = false;
            let id;
            if (this.bodyParams) {
              collection.insert(this.bodyParams, (err, _id) => {
                if (err) {
                  error = true;
                }
                id = _id;
              });
              return error ? {
                status: "Failed",
                statusCode: 500,
                message: `unable to add ${collectionName}`
              } : {
                status: "success",
                statusCode: 200,
                data: {
                  id
                }
              };
            }
          }
          return {
            statusCode: 403, status: "failed",
            message: "You do not have permission to add a record"
          };
        }
      },
      get: {
        authRequired: true,
        action() {
          if (hasPermission(this.user, "admin")
            || hasPermission(this.user, "guest")
            || hasPermission(this.user, "owner")) {
            const found = collection.findOne(this.urlParams.id);
            if (found !== undefined) {
              return {
                status: "success",
                statusCode: 200,
                data: found
              };
            }
            return {
              status: "failed",
              statusCode: 404,
              message: `Could not find ${collectionName} with id ${this.urlParams.id}`
            };
          }
          return {
            statusCode: 403, status: "failed",
            message: "You do not have permission to add a record"
          };
        }
      },

      put: {
        authRequired: true,
        action() {
          if (hasPermission(this.user, "admin")
            || hasPermission(this.user, "owner")) {
            const updated = collection.update(this.urlParams.id, this.bodyParams, { upsert: true });
            if (!updated) {
              return {
                status: "failed",
                statusCode: 500,
                message: "Request was not processed"
              };
            }
            return {
              status: "success",
              statusCode: 200,
              data: updated
            };
          }
          return {
            statusCode: 403, status: "failed",
            message: "You do not have permission to add a record"
          };
        }

      },
      delete: {
        authRequired: true,
        action() {
          if (hasPermission(this.user, "admin")
            || hasPermission(this.user, "owner")) {
            if (collection.remove(this.urlParams.id)) {
              return {
                status: "success",
                data: {
                  message: `${collectionName} deleted successfuly`
                }
              };
            }
            return {
              status: "failed",
              statusCode: 404,
              message: `${collectionName} not found`
            };
          }
          return {
            statusCode: 403, status: "failed",
            message: "You do not have permission to add a record"
          };
        }
      }
    }
  });
}


export default () => {
  creatRestApiFor("Accounts", collections.Accounts);
  creatRestApiFor("Cart", collections.Cart);
  creatRestApiFor("Emails", collections.Emails);
  creatRestApiFor("Inventory", collections.Inventory);
  creatRestApiFor("Orders", collections.Orders);
  creatRestApiFor("Products", collections.Products);
  creatRestApiFor("Shops", collections.Shops);
};
