import React from "react";
import PropsTypes from "prop-types";

const TableCell = (props) => {
  return (
    <div className="cell">{props.value}</div>
  );
};

TableCell.propTypes = {
  value: PropsTypes.string
};
export default TableCell;
