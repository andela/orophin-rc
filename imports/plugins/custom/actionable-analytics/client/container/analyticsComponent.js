import React, { Component } from "react";
import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";
import ActionableAnalytics from "../components/actionableAnalytics";
import { Products, ProductRatings } from "/lib/collections";


class AnalyticsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topEarningProducts: [],
      overviews: [],
      ordersAnalytics: [],
      statementOfAccount: [],
      topSellingProducts: [],
      topRatedProducts: [],
      orders: "",
      to: null,
      tableDetails: [],
      from: new Date(),
      analyticsData: {}
    };
  }

  componentDidMount = () => {
    this.setup();
  }

  getTopSellingData = () => {
    const topSellingProductCol = [
      { Header: "Product", accessor: "product" },
      { Header: "Quantity Sold", accessor: "quantitySold" }
    ];
    return {
      column: topSellingProductCol,
      data: this.state.topSellingProducts
    };
  }

  getTopEarningData = () => {
    const topEarningProductCol = [
      { Header: "Product", accessor: "product" },
      { Header: "Total Earnings", accessor: "totalSales" }
    ];
    return {
      column: topEarningProductCol,
      data: this.state.topEarningProducts
    };
  }

  getTopRatedProducts = () => {
    const topRatedProductCol = [
      { Header: "Product", accessor: "productName" },
      { Header: "Ratings", accessor: "rating" }
    ];
    return {
      column: topRatedProductCol,
      data: this.state.topRatedProducts
    };
  }

  getStatement = () => {
    const statementCol = [{ Header: "Date", accessor: "dateString" },
      { Header: "Product Name", accessor: "title" },
      { Header: "Quntity", accessor: "quantity" },
      { Header: "Total Sales", accessor: "totalSales" }];
    return {
      column: statementCol,
      data: this.state.statementOfAccount
    };
  }

  getOverviews = (analyticsOrder) => {
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

  getOrderStatement = () => {
    const orderStatementCol = [{ Header: "Date", accessor: "date" },
      { Header: "Destination Country", accessor: "country" },
      { Header: "Destination City", accessor: "city" },
      { Header: "Tax", accessor: "taxes" },
      { Header: "Shipping", accessor: "shipping" },
      { Header: "Payment Processor", accessor: "paymentProcessor" }];
    return {
      column: orderStatementCol,
      data: this.state.ordersAnalytics
    };
  }

  getSelectedDate = (from, to) => {
    this.setup(from, to);
  }

  setup = (from = null, to = new Date()) => {
    const analyticsOrders = this.props.fetchDataWithDate(from, to);
    const products = this.props.fetchDataWithDate(from, to, Products);
    const analyticsData = this.props.extractAnalyticsItems(analyticsOrders);
    this.setState({
      analyticsData,
      topRatedProducts: this.props.getTopRatedProducts(products),
      overviews: this.getOverviews(analyticsData),
      topEarningProducts: this.props.topEarning(analyticsData.analytics),
      ordersAnalytics: analyticsData.ordersAnalytics,
      topSellingProducts: this.props.topSelling(analyticsData.analytics),
      statementOfAccount: this.props.statementsAnalysis(analyticsData.analyticsStatement)
    });
  }

  getTableDetails = () => {
    return [this.state.overviews, this.getTopSellingData(), this.getTopEarningData(), this.getTopRatedProducts(), this.getStatement(), this.getOrderStatement()];
  }

  render() {
    const table = this.getTableDetails();
    const chartDataNameValue = [{}, { name: "product", value: "quantitySold" }, { name: "product", value: "salesSorter" },
      { name: "productName", value: "rating" }, {}, {}];
    return (
      <ActionableAnalytics
        tableDetails={table}
        chartDataNameValue={chartDataNameValue}
        fetchDataWithDate={this.props.fetchDataWithDate}
        getSelectedDate={this.getSelectedDate}
        displayChartFor={this.props.displayChartFor}
      />
    );
  }
}

AnalyticsComponent.propTypes = {
  displayChartFor: PropTypes.func.isRequired,
  extractAnalyticsItems: PropTypes.func.isRequired,
  fetchDataWithDate: PropTypes.func.isRequired,
  getTopRatedProducts: PropTypes.func,
  statementsAnalysis: PropTypes.func.isRequired,
  topEarning: PropTypes.func.isRequired,
  topSelling: PropTypes.func.isRequired
};
registerComponent("AnalyticsComponent", AnalyticsComponent);
export default AnalyticsComponent;
