import _ from "lodash";
import { formatPriceString } from "/client/api";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Orders, ProductRatings, Products } from "/lib/collections";
import AnalyticsComponent from "./analyticsComponent";

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
        shipping: order.billing[0].invoice.shipping,
        taxes: order.billing[0].invoice.taxes
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
  return { totalSales, totalItemsPurchased, totalShippingCost, analytics, analyticsStatement, ordersAnalytics, ordersCancelled };
};

const getPayment = (myAnalytics) => {
  const rank = { Paystack: 0, Wallet: 0, Example: 0 };
  const frequency = [];
  const names = [];

  myAnalytics.forEach((analytic) => {
    const key = analytic.paymentProcessor;
    if (rank[key]) {
      rank[key]++;
    } else {
      rank[key] = 1;
    }
  });

  Object.keys(rank).forEach((element) => {
    names.push(element);
    frequency.push(rank[element]);
  });
  return {
    frequency,
    names
  };
};

const getDailySales = (statement) => {
  const salesObj = {};
  let frequency = [];
  let names = [];
  statement.forEach((analytics) => {
    const data = analytics.dateString;
    let totalSale = analytics.totalSales.replace("$", "");
    totalSale = totalSale.replace(",", "");
    totalSale = parseFloat(totalSale);
    if (salesObj[data]) {
      salesObj[data] += totalSale;
    } else {
      salesObj[data] = totalSale;
    }
  });
  Object.keys(salesObj).forEach((element) => {
    names.push(element);
    frequency.push(salesObj[element]);
  });
  frequency = frequency.reverse();
  names = names.reverse();
  return {
    frequency,
    names
  };
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
      totalSales: formatPriceString(analytics[key].totalSales)
    });
  });
  return _.orderBy(
    products,
    product => product.salesSorter,
    "desc"
  );
};

const daysDifference = (date1, date2) => {
  // a Day represented in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;
  // Calculate the difference in milliseconds
  const difference = new Date(new Date(date2).setHours(23)) - new Date(new Date(date1).setHours(0));
  // Convert back to days and return
  return Math.round(difference / oneDay);
};

const setUpAverageSales = (totalSales, fromDate, toDate) => {
  const difference = daysDifference(Date.parse(fromDate), Date.parse(toDate));
  const salesPerDay = difference === 0 ? totalSales : totalSales / difference;
  return salesPerDay;
};

const statementsAnalysis = (myAnalytics) => {
  const statements = [];
  const analyticsStatement = myAnalytics;

  Object.keys(analyticsStatement).forEach((key) => {
    statements.push(analyticsStatement[key]);
    analyticsStatement[key].totalSales = this.formatPriceString(analyticsStatement[key].totalSales);
  });
  return _.orderBy(
    statements,
    statement => Date.parse(statement.dateString),
    "desc"
  );
};

const getOverViews = (analyticsOrder) => {
  return [
    {
      label: "Total Sales",
      value: analyticsOrder.totalSales
    },
    {
      label: "Total Shipping Cost",
      value: analyticsOrder.totalShippingCost
    },
    {
      label: "Total Items Purchased",
      value: analyticsOrder.totalItemsPurchased
    },
    {
      label: "Orders Cancelled",
      value: analyticsOrder.ordersCancelled
    },
    {
      label: "Total Orders Placed",
      value: analyticsOrder.ordersAnalytics.length
    }
  ];
};

const getAverageRating = (product, ratings) => {
  let totalRating = 0;
  let averageRating = 0;
  const productRatings = ratings.filter(rating => product._id === rating.rateeId);

  productRatings.map((rating) => {
    totalRating += rating.ratingsScore;
  });
  const raters = ratings.length;
  if (raters < 1) {
    averageRating = "0.0";
  } else {
    averageRating = ((totalRating / (5 * raters)) * 5).toFixed(1);
  }
  return { productName: product.title, rating: averageRating };
};

function composer(props, onData) {
  const orderSubscription = Meteor.subscribe("Orders");
  const ratingSubscriptions = Meteor.subscribe("ProductRating");
  const productSubscriptions = Meteor.subscribe("Products");

  if (orderSubscription.ready() && ratingSubscriptions.ready() && productSubscriptions.ready()) {
    const analyticsOrders = Orders.find({
      createdAt: {
        $gte: new Date("2017-10-03"),
        $lte: new Date()
      }
    }).fetch();
    const ratings = ProductRatings.find().fetch();
    const products = Products.find({ type: "simple", isVisible: true }).fetch();
    // const initialStartDate = new Date();
    // const initialEndDate = new Date();
    const productRatings = products.map(product => getAverageRating(product, ratings))
      .sort((a, b) => a.rating < b.rating);
    const analyticsData = extractAnalyticsItems(analyticsOrders);
    const overview = getOverViews(analyticsData);
    const topEarningProducts = topEarning(analyticsData.analytics);
    const topSellingProducts = topSelling(analyticsData.analytics);


    onData(null, {
      overview,
      topEarningProducts,
      topSellingProducts,
      ratings,
      productRatings
      // initialStartDate,
      // initialEndDate
    });
  }
}

export default composeWithTracker(composer)(AnalyticsComponent);
