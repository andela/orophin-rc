import React, { Component } from "react";
import PropsTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { registerComponent } from "@reactioncommerce/reaction-components";

class ActionablePieChart extends Component {
  state = {
    data: this.props.data,
    colors: ["#D9E3F0", "#F47373", "#697689", "#37D67A", "#2CCCE4", "#555555", "#dce775", "#ff8a65", "#ba68c8"]
  }
  render = () => {
    const {
      data,
      colors
    } = this.state;
    return (
      <PieChart width={1000} height={500} className={this.props.className}>
        <Pie data={data} fill="#8884d8" label dataKey="value">
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]}/>
            ))
          }
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
}

ActionablePieChart.propTypes = {
  className: PropsTypes.string,
  data: PropsTypes.arrayOf(PropsTypes.shape).isRequired
};

ActionablePieChart.defaultProps = {
  className: ""
};


registerComponent("ActionablePieChart", ActionablePieChart);
export default ActionablePieChart;
