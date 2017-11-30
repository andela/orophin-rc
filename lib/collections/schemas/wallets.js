import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { schemaIdAutoValue } from "./helpers";
import { registerSchema } from "@reactioncommerce/reaction-collections";

/**
 * @name Wallet
 * @summary Schema for user's wallet
 * @type {SimpleSchema}
 * @memberof schemas
 * @property {String} _id optional, Shipment Line Item
 * @property {Number} balance required
 * @property {String} ownerEmail required
 */
export const Wallets = SimpleSchema({
  _id: {
    type: String,
    optional: true,
    autoValue: schemaIdAutoValue
  },
  ownerEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  balance: {
    type: Number,
    optional: false
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    }
  }
});
