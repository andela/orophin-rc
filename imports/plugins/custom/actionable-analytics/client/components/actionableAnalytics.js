import React, { Component } from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { registerComponent, Components } from "@reactioncommerce/reaction-components";
import DatePicker from "./dataPicker";
import ActionablePieChart from "./pieChart";
import TableCell from "./tableCell";
import SimpleBart from "./barChart";

class ActionableAnalytics extends Component {
  state = {
    tabs: this.props.tabs,
    columns: this.props.columns,
    tableData: this.props.tableData,
    pieChartData: this.props.pieChartData,
    selected: 0,
    tabTitle: this.props.tabs[0]
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

  renderBarChart() {
    return <SimpleBart data={this.props.data}/>;
  }

  renderOverview = () => {
    if (this.state.selected > 0) return null;

    const { ListItem, List } = Components;
    const overviews  = this.props.overviews || [];
    const Label = (props) => <span>{props.label}: <em>{props.value}</em></span>;

    return (
      <List>
        {overviews.map((overview) => (
          <ListItem key={`${overview.value}${Date.now()}`}>
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

  changeTableData(index) {
    this.setState({
      columns: this.props.tableDetails[index].column,
      tableData: this.props.tableDetails[index].data
    });
  }
  handleTabClick = (event, value, index) => {
    this.setState({
      selected: index,
      tabTitle: this.state.tabs[index]
    });
    this.changeTableData(index - 1);
  }

  renderTable = () => {
    const {
      columns,
      tableData,
      selected
    } = this.state;

    if (selected <= 0) return null;

    return (
      <ReactTable
        columns={columns}
        data={tableData}
        filterType={"column"}
      />
    );
  }

  render() {
    const { TabList } = Components;

    const {
      pieChartData,
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
            setOrders={this.props.setOrders}
            {...this.props}
            // initialEndDate={this.props.initialEndDate}
            // initialStartDate={this.props.initialStartDate}
            // FetchDataWithDate={this.props.FetchDataWithDate}
          />
          <div className="actionable-tab-wrapper">
            <TabList selectedTab={this.state.selected}>
              {this.renderTabItems()}
            </TabList>
          </div>
          <h3 className="tab-title">{tabTitle}</h3>
          <div className="clo-12 actionable-table-wrapper">
            {this.renderOverview()}
            {this.renderTable()}
          </div>
          {/* {this.renderBarChart()} */}
          <ActionablePieChart className="actionable-chart-wrapper" data={pieChartData}/>
        </div>
      </div>
    );
  }
}

ActionableAnalytics.propTypes = {
  changeTableData: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape),
  getFirstDate: PropTypes.func,
  getSecondDate: PropTypes.func,
  initialEndDate: PropTypes.any,
  initialStartDate: PropTypes.any,
  overviews: PropTypes.arrayOf(PropTypes.shape).isRequired,
  pieChartData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  tableDetails: PropTypes.arrayOf(PropTypes.shape).isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape)
};

ActionableAnalytics.defaultProps = {
  columns: [
    {
      Header: "product Name",
      accessor: "product" // String-based value accessors!
    },
    {
      Header: "Age",
      accessor: "quantitySold",
      Cell: TableCell
    }
    // {
    //   id: "friendName", // Required because our accessor is not a string
    //   Header: "Friend Name",
    //   accessor: d => d.friend.name // Custom value accessors!
    // },
    // {
    //   id: "friendAge", // Required because our accessor is not a string
    //   Header: "Friend Age",
    //   accessor: d => d.friend.age // Custom value accessors!
    // }
  ],
  data: [{ a: 23 }, { b: 34 }, { c: 50 }],
  getFirstDate: () => {},
  getSecondDate: () => {},
  tableData: [
    {
      name: "Tanner Linsley",
      age: 26,
      friend: {
        name: "Jason Maurer",
        age: 23
      }
    }
  ],
  pieChartData: [
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 }
  ],
  // overiews: [{ label: "hello", value: "world" }],
  tabs: ["overview", "Top Selling", "Top Earners", "Top Rated", "Statement", "Orders"]
};

registerComponent("ActionableAnalytics", ActionableAnalytics);
export default ActionableAnalytics;
