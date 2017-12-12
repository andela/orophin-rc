import React, { Component } from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import ActionableAnalytics from "../components/actionableAnalytics";


class AnalyticsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: ""
    };
  }

  setOrders = (orders) => {
    this.setState({ orders });
  }
  getFirstDate(date) {
    this.props.setFirstDate(date);
  }
  getSecondDate(date) {
    this.props.setSecondDate(date);
  }

  changeTableData = (index) => {
    this.setState({ tableData: this.props.tableData[ index ] });
  }

  getTopSellingData() {
    const topSellingProductCol = [
      { Header: "Product", accessor: "product" },
      { Header: "Quantity Sold", accessor: "quantitySold" }
    ];
    return {
      column: topSellingProductCol,
      data: this.props.topSellingProducts
    };
  }
  getTableDetails() {
    const tableDetails = [this.getTopSellingData(), this.getTopEarningData(), this.getTopRatedProducts(), this.getStatement(), this.getOrderStatement()];
    return tableDetails;
  }

  getTopEarningData() {
    const topEarningProductCol = [
      { Header: "Product", accessor: "product" },
      { Header: "Total Earnings", accessor: "totalSales" }
    ];
    return {
      column: topEarningProductCol,
      data: this.props.topEarningProducts
    };
  }

  getTopRatedProducts() {
    const topRatedProductCol = [
      { Header: "Product", accessor: "productName" },
      { Header: "Ratings", accessor: "rating" }
    ];
    return {
      column: topRatedProductCol,
      data: this.props.topRatedProducts
    };
  }
  getStatement() {
    const statementCol = [{ Header: "Date", accessor: "dateString" },
      { Header: "Product Name", accessor: "title" },
      { Header: "Quntity", accessor: "quantity" },
      { Header: "Total Sales", accessor: "totalSales" }];
    return {
      column: statementCol,
      data: this.props.statementOfAccount
    };
  }
  getOrderStatement() {
    const orderStatementCol = [{ Header: "Date", accessor: "date" },
      { Header: "Destination Country", accessor: "country" },
      { Header: "Destination City", accessor: "city" },
      { Header: "Tax", accessor: "taxes" },
      { Header: "Shipping", accessor: "shipping" },
      { Header: "Payment Processor", accessor: "paymentProcessor" }];
    return {
      column: orderStatementCol,
      data: this.props.ordersAnalytics
    };
  }

  render() {
    return (
      <ActionableAnalytics
        overviews={this.props.overview}
        getSecondDate={this.setSecondDate}
        getFirstDate={this.setFirstDate}
        initialStartDate={this.props.initialStartDate}
        initialEndDate={this.props.initialEndDate}
        tableDetails={this.getTableDetails()}
        FetchDataWithDate={this.props.FetchDataWithDate}
        setOrders={this.setOrders}
      />
    );
  }
}

registerComponent("AnalyticsComponent", AnalyticsComponent);
export default AnalyticsComponent;
