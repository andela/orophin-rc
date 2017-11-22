import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { registerSchema } from "@reactioncommerce/reaction-collections";

/**
 * @typedef {SimpleSchema} SimpleSchema
 * @summary SimpleSchema for Collections - Reaction uses {@link https://github.com/aldeed/meteor-simple-schema SimpleSchema} to apply basic content and structure validation to Collections. See {@link https://docs.reactioncommerce.com/reaction-docs/master/simple-schema full documentation}.
 */

/**
 * @file Reaction Core schemas
 * Reaction uses {@link https://github.com/aldeed/meteor-simple-schema SimpleSchema} to apply basic content and structure validation to Collections.
 * See {@link https://docs.reactioncommerce.com/reaction-docs/master/simple-schema full documentation}.
 * @namespace schemas
 */

/**
 * @name Ratings
 * @memberof schemas
 * @type {SimpleSchema}
 * @property {String} userId required
 * @property {String} productId required
 * @property {Number} ratingsScore optional
 * @property {Date} createdAt required
 * @property {Date} updatedAt optional
 */
export const Ratings = new SimpleSchema({
  userId: {
    type: String
  },
  productId: {
    type: String
  },
  ratingsScore: {
    type: Number,
    optional: true
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
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return {
          $set: new Date
        };
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    optional: true
  }
});

registerSchema("Ratings", Ratings);
