import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import { Reaction } from "/client/api";
import { TextField, Button, IconButton, SortableTableLegacy } from "@reactioncommerce/reaction-ui";
import ProductGridContainer from "/imports/plugins/included/product-variant/containers/productGridContainer";
import { accountsTable } from "../helpers";

class SearchModal extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    handleAccountClick: PropTypes.func,
    handleChange: PropTypes.func,
    handleClick: PropTypes.func,
    handleTagClick: PropTypes.func,
    handleToggle: PropTypes.func,
    products: PropTypes.array,
    siteName: PropTypes.string,
    tags: PropTypes.array,
    unmountMe: PropTypes.func,
    value: PropTypes.string
  }
  constructor(props) {
    super(props);
    this.state = {
      products: this.props.products,
      lowPriceFilter: 0,
      highPriceFilter: 0
    };
  }

  componentDidMount() {
    this.setState({ products: this.props.products });
  }

  handleClear = (event) => {
    this.props.handleClick(event);
    this.setState({ products: this.props.products });
  }

  handleProductSort = (id) => {
    const selected = document.getElementById(id);
    const unsorted = [...this.props.products];
    let sortedProducts = [];
    if (selected.value === "highest-price") {
      sortedProducts = _.orderBy(unsorted, ["price.max"], ["desc"]);
      this.setState({ products: sortedProducts });
    } else if (selected.value === "lowest-price") {
      sortedProducts = _.orderBy(unsorted, ["price.max"], ["asc"]);
      this.setState({ products: sortedProducts });
    } else {
      this.setState({ products: this.props.products });
    }
  }

  handleFilterProductByVendor = (event) => {
    let filtered = [];
    const unfiltered = [...this.props.products];
    if (event.target.value === "all") {
      this.setState({ products: this.props.products });
    }
    if (event.target.value && event.target.value !== "all") {
      filtered = unfiltered.filter(product => product.vendor === event.target.value);
      this.setState({ products: filtered });
    }
  }

  handleSortByAlphabet = (event) => {
    let SortedProducts = [];
    const unsorted = [...this.props.products];
    if (event.target.value === "asc") {
      SortedProducts = _.orderBy(unsorted, ["title"], ["asc"]);
      this.setState({ products: SortedProducts });
    }
    if (event.target.value === "desc") {
      SortedProducts = _.orderBy(unsorted, ["title"], ["desc"]);
      this.setState({ products: SortedProducts });
    }
    if (event.target.value === "all") {
      this.setState({ products: this.props.products });
    }
  }

  handlePriceChange = (event) => {
    event.preventDefault();
    if (event.target.name === "lowest") {
      this.setState({ lowPriceFilter: event.target.value });
    }
    if (event.target.name === "highest") {
      this.setState({ highPriceFilter: event.target.value });
    }
  }

  handleFilterByPrice = (event) => {
    event.preventDefault();
    const filtered = this.props.products.filter((product) => product.price.max >= this.state.lowPriceFilter && product.price.max <= this.state.highPriceFilter);
    this.setState({ products: filtered });
  }

  renderSortByAlphabet() {
    return (
      <div className="select-input col-md-3">
        <p>Sort By Name</p>
        <div className="rui select">

          <select name="" id="product-filter" onChange={this.handleSortByAlphabet}>
            <option value="all" defaultValue>Sort Order</option>
            <option value="asc" >Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    );
  }

  renderFilterByPrice() {
    return (
      <div className="price-input col-md-3">
        <span> Price Filter:&nbsp; </span>
        <form className="form-input">
          <input type="number" name="lowest" onChange={this.handlePriceChange} className="input-field" />
          <span className="input-text"> to </span>
          <input type="number" name="highest" onChange={this.handlePriceChange} className="input-field" />
          <button className="search-filter-btn" onClick={this.handleFilterByPrice} >Filter</button>
        </form>
      </div>
    );
  }

  renderSearchPriceSort() {
    return (
      <div className="select-input col-md-3">
        <p>Sort By Price</p>
        <div className="rui select">
          <select name="sort" id="product-sort" onChange={() => this.handleProductSort("product-sort")}>
            <option value="all" defaultValue>Sort By</option>
            <option value="highest-price">Highest price</option>
            <option value="lowest-price">Lowest Price</option>
          </select>
        </div>
      </div>
    );
  }

  renderFilterByVendor() {
    let vendors = [];
    for (let i = 0; i < this.props.products.length; i += 1) {
      vendors.push(this.props.products[i].vendor);
    }
    vendors = _.uniq(vendors);
    const vendorsOption = vendors.map(vendor => <option key={vendor} value={vendor} >{vendor}</option>);
    return (
      <div className="select-input col-md-3">
        <p>Filter By Brand</p>
        <div className="rui select">
          <select onChange={this.handleFilterProductByVendor}>
            <option value="all" defaultValue>Filter By </option>
            {vendorsOption}
          </select>
        </div>
      </div>
    );
  }

  renderSearchInput() {
    return (
      <div className="rui search-modal-input">
        <label data-i18n="search.searchInputLabel">Search {this.props.siteName}</label>
        <i className="fa fa-search search-icon" />
        <TextField
          className="search-input"
          textFieldStyle={{ marginBottom: 0 }}
          onChange={this.props.handleChange}
          value={this.props.value}
        />
        <Button
          className="search-clear"
          i18nKeyLabel="search.clearSearch"
          label="Clear"
          containerStyle={{ fontWeight: "normal" }}
          onClick={this.handleClear}
        />
      </div>
    );
  }

  renderSearchTypeToggle() {
    if (Reaction.hasPermission("admin")) {
      return (
        <div className="rui search-type-toggle">
          <div
            className="search-type-option search-type-active"
            data-i18n="search.searchTypeProducts"
            data-event-action="searchCollection"
            data-event-value="products"
            onClick={() => this.props.handleToggle("products")}
          >
            Products
          </div>
          {Reaction.hasPermission("accounts") &&
            <div
              className="search-type-option"
              data-i18n="search.searchTypeAccounts"
              data-event-action="searchCollection"
              data-event-value="accounts"
              onClick={() => this.props.handleToggle("accounts")}
            >
              Accounts
            </div>
          }
        </div>
      );
    }
  }

  renderProductSearchTags() {
    return (
      <div className="rui search-modal-tags-container">
        <p className="rui suggested-tags" data-i18n="search.suggestedTags">Suggested tags</p>
        <div className="rui search-tags">
          {this.props.tags.map((tag) => (
            <span
              className="rui search-tag"
              id={tag._id} key={tag._id}
              onClick={() => this.props.handleTagClick(tag._id)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="rui search-modal-close"><IconButton icon="fa fa-times" onClick={this.props.unmountMe} /></div>
        <div className="rui search-modal-header">
          {this.renderSearchInput()}
          {this.renderSearchTypeToggle()}
          <div className="sort-filter row">

            {this.props.products.length > 0 && this.renderSearchPriceSort()}
            {this.props.products.length > 0 && this.renderSortByAlphabet()}
            {this.props.products.length > 0 && this.renderFilterByVendor()}
            {this.props.products.length > 0 && this.renderFilterByPrice()}
          </div>
          {this.props.tags.length > 0 && this.renderProductSearchTags()}

        </div>
        <div className="rui search-modal-results-container">
          {this.props.products.length > 0 &&
            <ProductGridContainer
              products={this.state.products.length > 0 ? this.state.products : this.props.products}
              unmountMe={this.props.unmountMe}
              isSearch={true}
            />
          }
          {this.props.accounts.length > 0 &&
            <div className="data-table">
              <div className="table-responsive">
                <SortableTableLegacy
                  data={this.props.accounts}
                  columns={accountsTable()}
                  onRowClick={this.props.handleAccountClick}
                />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default SearchModal;
