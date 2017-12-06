import React, { Component } from "react";
import ReactTable from "react-table";
import PropTypes from "prop-types";
import { registerComponent, Components } from "@reactioncommerce/reaction-components";
import DatePicker from "./dataPicker";
import ActionablePieChart from "./pieChart";
import TableCell from "./tableCell";

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
  renderOverview = () => {
    if (this.state.selected > 0) return null;

    const { ListItem, List } = Components;
    const { overiews } = this.props;
    const Label = (props) => <span>{props.label}: <em>{props.value}</em></span>;

    return (
      <List>
        {overiews.map((overview) => (
          <ListItem key={`${overview.value}${Date.now()}`}>
            <Label
              title={overview.label}
              value={overview.value}
            />
          </ListItem>)
        )}
      </List>
    );
  }
  handleTabClick = (event, value, index) => {
    this.setState({
      selected: index,
      tabTitle: this.state.tabs[index]
    });
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
         <DatePicker getFirstDate={getFirstDate} getSecondDate={getSecondDate}/>
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
         <ActionablePieChart className="actionable-chart-wrapper" data={pieChartData}/>
       </div>
     </div>
   );
 }
}

ActionableAnalytics.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape).isRequired,
  getFirstDate: PropTypes.func,
  getSecondDate: PropTypes.func,
  overiews: PropTypes.arrayOf(PropTypes.shape),
  pieChartData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  tabs: PropTypes.arrayOf(PropTypes.shape)
};

ActionableAnalytics.defaultProps = {
  columns: [
    {
      Header: "Name",
      accessor: "name" // String-based value accessors!
    },
    {
      Header: "Age",
      accessor: "age",
      Cell: TableCell
    },
    {
      id: "friendName", // Required because our accessor is not a string
      Header: "Friend Name",
      accessor: d => d.friend.name // Custom value accessors!
    },
    {
      id: "friendAge", // Required because our accessor is not a string
      Header: "Friend Age",
      accessor: d => d.friend.age // Custom value accessors!
    }
  ],
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
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 }
  ],
  overiews: [{ label: "hello", value: "world" }],
  tabs: ["overview", "tab2", "ActionableAnalytics", "ActionableAnalytics"]
};

registerComponent("ActionableAnalytics", ActionableAnalytics);
export default ActionableAnalytics;
