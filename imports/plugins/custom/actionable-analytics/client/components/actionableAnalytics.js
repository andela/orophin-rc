import React, { Component } from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { registerComponent, Components } from "@reactioncommerce/reaction-components";
import DatePicker from "./dataPicker";
import SimplePieChart from "./pieChart";
import TableCell from "./tableCell";
import SimpleBarChart from "./barChart";

class ActionableAnalytics extends Component {
  state = {
    tabs: this.props.tabs,
    columns: this.props.tableDetails[0].column,
    tableData: this.props.tableDetails[0].data,
    tableDetails: this.props.tableDetails,
    nameValue: this.props.chartDataNameValue,
    selected: 0,
    currentIndex: 0,
    tabTitle: this.props.tabs[0]
  }

  componentWillUpdate(nextProps) {
    if (nextProps.tableDetails !== this.props.tableDetails) {
      this.setState({
        columns: nextProps.tableDetails[0].column,
        selected: 0,
        tableData: nextProps.tableDetails[0].data
      });
    }
  }

  renderTabItems = () => {
    const className = "actionable-tab";
    const { TabItem } = Components;
    return (
      this.state.tabs.map((item, i) => (
        <TabItem
          key={i}
          className={className}
          onClick={this.handleTabClick}
        >
          {item}
        </TabItem>
      ))
    );
  }

  renderBarChart(data) {
    const currentData = data[this.state.selected].data;
    const rendered = this.props.displayChartFor(currentData, this.state.nameValue[this.state.selected].name, this.state.nameValue[this.state.selected].value);
    if (!rendered.length > 0) {
      return null;
    }
    return <SimpleBarChart data={rendered}/>;
  }

  renderPieChart(data) {
    const currentData = data[this.state.selected].data;
    const rendered = this.props.displayChartFor(currentData, this.state.nameValue[this.state.selected].name, this.state.nameValue[this.state.selected].value);
    if (rendered.length < 1) {
      return null;
    }
    return <SimplePieChart data={rendered}/>;
  }

  renderOverview = (overviews) => {
    if (this.state.selected > 0) return null;
    if (overviews) {
      const { ListItem, List } = Components;
      const Label = (props) => {
        return (
          <span>
            {props.label}: <b>{props.value}</b>
          </span>);
      };
      return (
        <List>
          {overviews.map((overview, i) => (
            <ListItem key={i}>
              <span>{overview.label}</span>
              <Label
                title={overview.label}
                value={overview.value}
              />
            </ListItem>)
          )}
        </List>
      );
    }
  }

  changeTableData(index) {
    this.setState({
      columns: this.props.tableDetails[index].column,
      tableData: this.props.tableDetails[index].data,
      currentIndex: index
    });
  }

  handleTabClick = (event, value, index) => {
    this.setState({
      selected: index,
      tabTitle: this.state.tabs[index]
    });
    this.changeTableData(index);
  }

  renderTable = () => {
    const {
      columns,
      tableData,
      selected
    } = this.state;

    if (selected <= 0) return null;
    if (tableData.length < 1) {
      return (
        <Components.NotFound message="No record found"/>
      );
    }
    return (
      <ReactTable
        columns={columns}
        data={tableData}
        filterType={"column"}
        defaultPageSize={6}
      />
    );
  }

  render() {
    const { TabList } = Components;

    const {
      tabTitle
    } = this.state;

    const {
      getFirstDate,
      getSecondDate
    } = this.props;

    return (
      <div className="container-fluid">
        <h1 className="text-center actionable-header">Actionable Analytics</h1>
        <div className="row actionable-body">
          <DatePicker
            getFirstDate={getFirstDate}
            getSecondDate={getSecondDate}
            getSelectedDate={this.props.getSelectedDate}
            {...this.props}
          />
          <div className="actionable-tab-wrapper">
            <TabList selectedTab={this.state.selected}>
              {this.renderTabItems()}
            </TabList>
          </div>
          <h3 className="tab-title">{tabTitle}</h3>
          <div className="clo-12 actionable-table-wrapper">
            {this.renderOverview(this.props.tableDetails[0])}
            {this.renderTable()}
          </div>
          {this.renderBarChart(this.props.tableDetails)}
          {this.renderPieChart(this.props.tableDetails)}
        </div>
      </div>
    );
  }
}

ActionableAnalytics.propTypes = {
  chartDataNameValue: PropTypes.arrayOf(PropTypes.any),
  displayChartFor: PropTypes.func,
  fetchDataWithDate: PropTypes.func,
  getSelectedDate: PropTypes.func,
  tableDetails: PropTypes.arrayOf(PropTypes.shape).isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape)
};

ActionableAnalytics.defaultProps = {
  columns: [],
  getFirstDate: () => {},
  getSecondDate: () => {},
  tabs: [
    "Overviews",
    "Top Selling",
    "Top Earners",
    "Top Rated",
    "Statement",
    "Order Details"
  ]
};

registerComponent("ActionableAnalytics", ActionableAnalytics);
export default ActionableAnalytics;
