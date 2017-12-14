import _ from "lodash";
import React, { Component } from "react";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import formater from 'currency-formatter';
import { Orders, ProductRatings, Products } from "/lib/collections";
import AnalyticsComponent from "./analyticsComponent";

class AnalyticalSubsccription extends Component {
  render() {
    return (
      <AnalyticsComponent {...this.props} />
    );
  }
}

// const formatPriceString = (value) => {
//   return `₦${value}`;
// };

const extractAnalyticsItems = (allOrders) => {
  let totalSales = 0;
  let ordersCancelled = 0;
  let totalItemsPurchased = 0;
  let totalShippingCost = 0;
  const analytics = {};
  const analyticsStatement = {};
  const ordersAnalytics = [];
  allOrders.forEach((order) => {
    const orderDate = order.createdAt;
    const dateString = orderDate.toISOString().split("T")[0];
    if (order.workflow.status !== "canceled") {
      ordersAnalytics.push({
        date: dateString,
        country: order.billing[0].address.country,
        city: `${order.billing[0].address.city}, ${order.billing[0].address.region}`,
        paymentProcessor: order.billing[0].paymentMethod.processor,
        shipping: formater.format(order.billing[0].invoice.shipping, {symbol: '₦'}),
        taxes: formater.format(order.billing[0].invoice.taxes, {symbol: '₦'})
      });
      totalSales += parseFloat(order.billing[0].invoice.subtotal);
      totalItemsPurchased += order.items.length;
      totalShippingCost += parseFloat(order.billing[0].invoice.shipping);
      order.items.forEach((item) => {
        if (analytics[item.title]) {
          analytics[item.title].quantitySold += item.quantity;
          analytics[item.title].totalSales += item.variants.price * item.quantity;
        } else {
          analytics[item.title] = {
            quantitySold: item.quantity,
            totalSales: item.variants.price * item.quantity
          };
        }
        const uniqueStamp = `${dateString}::${item.title}`;
        if (analyticsStatement[uniqueStamp] && analyticsStatement[uniqueStamp].title === item.title) {
          analyticsStatement[uniqueStamp].totalSales += item.variants.price * item.quantity;
          analyticsStatement[uniqueStamp].quantity += item.quantity;
        } else {
          analyticsStatement[uniqueStamp] = {
            title: item.title,
            quantity: item.quantity,
            dateString,
            totalSales: item.variants.price * item.quantity
          };
        }
      });
    } else {
      ordersCancelled += 1;
    }
  });
  totalSales = formater.format(totalSales, {symbol: '₦'});
  totalShippingCost = formater.format(totalShippingCost, {symbol: '₦'});
  return { totalSales, totalItemsPurchased, totalShippingCost, analytics, analyticsStatement, ordersAnalytics, ordersCancelled };
};

const topSelling = (myAnalytics) => {
  const products = [];
  const analytics = myAnalytics;
  Object.keys(analytics).forEach((key) => {
    products.push({
      product: key,
      quantitySold: analytics[key].quantitySold
    });
  });
  return _.orderBy(
    products,
    product => product.quantitySold,
    "desc"
  );
};

const topEarning = (myAnalytics) => {
  const products = [];
  const analytics = myAnalytics;
  Object.keys(analytics).forEach((key) => {
    products.push({
      product: key,
      salesSorter: analytics[key].totalSales,
      totalSales: formater.format(analytics[key].totalSales, {symbol: '₦'})
    });
  });
  return _.orderBy(
    products,
    product => product.salesSorter,
    "desc"
  );
};

const statementsAnalysis = (myAnalytics) => {
  const statements = [];
  const analyticsStatement = myAnalytics;

  Object.keys(analyticsStatement).forEach((key) => {
    statements.push(analyticsStatement[key]);
    analyticsStatement[key].totalSales = formater.format(analyticsStatement[key].totalSales, {symbol: '₦'});
  });
  return _.orderBy(
    statements,
    statement => Date.parse(statement.dateString),
    "desc"
  );
};

const getStatement = (statement) => {
  const accountStatement = [];
  Object.keys(statement).map(key => accountStatement.push(statement[key]));
  return _.orderBy(
    accountStatement,
    accountStatements => Date.parse(accountStatements.dateString),
    "desc"
  );
};

const getAverageRating = (product, ratings) => {
  let totalRating = 0;
  let averageRating = 0;
  const productRatings = ratings.filter(rating => product._id === rating.rateeId);

  productRatings.map((rating) => {
    totalRating += rating.ratingsScore;
  });
  const raters = productRatings.length;
  if (raters < 1) {
    averageRating = "0.0";
  } else {
    averageRating = ((totalRating / (5 * raters)) * 5).toFixed(1);
  }
  return { productName: product.title, rating: averageRating };
};

const fetchDataWithDate = (from, to, model = Orders) => {
  const option1 = {};
  const option2 = {
    type: "simple",
    isVisible: true
  };
  let defaultOption = option1;
  if (model === Products) {
    defaultOption = option2;
  }
  if (to && from) {
    defaultOption.createdAt = {};
    defaultOption.createdAt.$gte = from;
    defaultOption.createdAt.$lte = to;
    return model.find(defaultOption).fetch();
  } else if (to && !from) {
    defaultOption.createdAt = {};
    defaultOption.createdAt.$lte = to;
    return model.find(defaultOption).fetch();
  } else if  (!to && from) {
    defaultOption.createdAt = {};
    defaultOption.createdAt.from = from;
    return model.find(defaultOption).fetch();
  }
  return model.find(defaultOption).fetch();
};

const getTopRatedProducts = (products) => {
  const ratings = ProductRatings.find().fetch();
  return products.map(product => getAverageRating(product, ratings))
    .sort((a, b) => a.rating < b.rating);
};

const displayChartFor = (data = [], dataName, dataValue) => {
  const chartData = data.map(each => {
    return {
      name: each[dataName],
      value: parseFloat(each[dataValue])
    };
  });
  return chartData;
};

function composer(props, onData) {
  const orderSubscription = Meteor.subscribe("Orders");
  const ratingSubscriptions = Meteor.subscribe("ProductRating");
  const productSubscriptions = Meteor.subscribe("Products");

  if (orderSubscription.ready() && ratingSubscriptions.ready() && productSubscriptions.ready()) {
    onData(null, {
      extractAnalyticsItems,
      topSelling,
      topEarning,
      statementsAnalysis,
      getStatement,
      getTopRatedProducts,
      fetchDataWithDate,
      displayChartFor
    });
  }
}

export default composeWithTracker(composer)(AnalyticalSubsccription);
