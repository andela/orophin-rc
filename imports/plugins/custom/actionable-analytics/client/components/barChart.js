import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { registerComponent } from "@reactioncommerce/reaction-components";
import PropTypes from "prop-types";

const SimpleBarChart = ({ data }) => (
  <BarChart width={600} height={300} data={data}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <XAxis dataKey="name"/>
    <YAxis/>
    <CartesianGrid strokeDasharray="3 3"/>
    <Tooltip/>
    <Legend />
    <Bar dataKey="pv" fill="#8884d8" />
    <Bar dataKey="uv" fill="#82ca9" />
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
