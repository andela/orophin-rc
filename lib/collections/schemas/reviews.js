import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";
/**
 * @name Reviews
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {string} content
 * @property {String} revieweeId
 * @property {String} reviewerId
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
export const Reviews = new SimpleSchema({
  content: {
    type: String,
    optional: false
  },
  revieweeId: {
    type: String,
    optional: false
  },
  reviewer: {
    type: String,
    optional: false
  },
  createdAt: {
    type: Date,
    optional: true,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();
    }
  },
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
});
registerSchema("Reviews", Reviews);
