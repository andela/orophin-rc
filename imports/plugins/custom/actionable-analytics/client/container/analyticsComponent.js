import React, { Component } from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import ActionableAnalytics from "../components/actionableAnalytics";


class AnalyticsComponent extends Component {
  getFirstDate(date) {
    console.log('first date', new Date(date));
  }
  getSecondDate(date) {
    console.log('second date', new Date(date));
  }
  render() {
    console.log(this.props.overview);
    // console.log(this.getDailySales(this.extractAnalyticsItems(this.props.analyticsOrders).analyticsStatement));
    console.log(this.props.topEarningProducts);
    console.log(this.props.topSellingProducts);
    
    console.log("products rating", this.props.productRatings);

    return (
      <ActionableAnalytics
        overviews={this.props.overview}
        getSecondDate={this.getSecondDate}
        getFirstDate={this.getFirstDate}
        initialStartDate={this.props.initialStartDate}
        initialEndDate={this.props.initialEndDate}
        tableData={this.props.topSellingProducts}
      />
    );
  }
}

registerComponent("AnalyticsComponent", AnalyticsComponent);
export default AnalyticsComponent;
