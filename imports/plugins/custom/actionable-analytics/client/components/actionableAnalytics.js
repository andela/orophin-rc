import React, { Component } from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import DatePicker from "./dataPicker";

class ActionableAnalytics extends Component {
  render() {
    return (
      <div className="container-fluid">
        <h1 className="text-center">Actionable Analytics</h1>
        <div className="row">
          <div className="col-12">
            <h4> Select a date</h4>
            <DatePicker />
          </div>
          <div className="clo-12 info-table">
           info table
          </div>
          <div className="clo-12 info-chart">
           info chart
          </div>
        </div>
      </div>
    );
  }
}

registerComponent("ActionableAnalytics", ActionableAnalytics);
export default ActionableAnalytics;
