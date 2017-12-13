import { BrowserPolicy } from "meteor/browser-policy-common";
/*
 * set browser policies
 */
BrowserPolicy.content.allowOriginForAll("https://js.paystack.co/v1/inline.js");
BrowserPolicy.content.allowOriginForAll("https://paystack.com");
