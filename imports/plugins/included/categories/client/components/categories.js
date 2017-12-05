import React, { Component } from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import PropTypes from "prop-types";
import { Router } from "/client/api";
import CATEGORIES from "../../../../service/categories";

class Categories extends Component {
  static propTypes = {
    iconSrc: PropTypes.string,
    label: PropTypes.string,
    param: PropTypes.string
  };

  renderCategory = (props) => {
    const {
      label,
      iconSrc,
      param
    } = props;
    return (
      <a
        href=""
        className="list-group-item"
        onClick={(e) => {
          e.preventDefault();
          Router.go(`/products/${param}`);
        }}
      >
        <img className="icon" src={`/resources/${iconSrc}`}alt="icon" width="15px" />
        {label}
      </a>
    );
  }
  render = () => {
    const Category = this.renderCategory;
    return (
      <div className="col-sm-3 list-group hidden-xs">
        {CATEGORIES.map(category => <Category key={category.label} {...category} />)}
      </div>
    );
  }
}

registerComponent("Categories", Categories);

export default Categories;
