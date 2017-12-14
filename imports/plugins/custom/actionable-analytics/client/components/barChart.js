import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { registerComponent } from "@reactioncommerce/reaction-components";
import PropTypes from "prop-types";

const SimpleBarChart = ({ data }) => (
  <BarChart width={1000} height={300} data={data}
    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
  >
    <XAxis dataKey="name"/>
    <YAxis/>
    <CartesianGrid strokeDasharray="3 3"/>
    <Legend width={100} wrapperStyle={{ backgroundColor: "#f5f5f5", border: "1px solid #d5d5d5", borderRadius: 3, lineHeight: "40px" }} />
    <Bar type="monotone" dataKey="value" fill="#8884d8" barSize={30}
      barGap={1}
    />
  </BarChart>
);

SimpleBarChart.defaultProps = {
  data: []
};

SimpleBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired
};

registerComponent("SimpleBarChart", SimpleBarChart);
export default SimpleBarChart;
