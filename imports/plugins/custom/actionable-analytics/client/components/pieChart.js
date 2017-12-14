import React from "react";
import PropsTypes from "prop-types";
import { PieChart, Pie, Tooltip } from "recharts";
import { registerComponent } from "@reactioncommerce/reaction-components";

const SimplePieChart = ({ data }) => {
  return (
    <PieChart width={800} height={400}>
      <Pie isAnimationActive={false}
        data={data}
        dataKey="value"
        cx={200}
        cy={200}
        outerRadius={80} fill="#8884d8" label
      />
      <Pie data={data} cx={500} cy={200}
        dataKey="value"
        innerRadius={40}
        outerRadius={80}
        fill="#82ca9d"
      />
      <Tooltip/>
    </PieChart>
  );
};


SimplePieChart.propTypes = {
  data: PropsTypes.arrayOf(PropsTypes.shape).isRequired
};

SimplePieChart.defaultProps = {
  data: []
};

registerComponent("SimplePieChart", SimplePieChart);
export default SimplePieChart;


