import React, { Component } from "react";
import { SingleDatePicker } from "react-dates";
import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";
import moment from "moment";

class DatePicker extends Component {
  state = {
    firstDatePickerFocus: false,
    secondDatePickerFocus: false,
    // focusedOnDateTwo: false,
    analyticsOrders: this.props.analyticsOrders,
    to: moment(),
    from: moment("2017-10-03")
  }

  // onfirstDateChange = (date) => {
  //   this.setState({ firstDate: date });
  //   // this.props.getFirstDate(date);
  // }


  componentDidUpdate(prevState) {
    if (prevState.to !== this.state.to || prevState.from !== this.state.from) {
      const orders = this.props.FetchDataWithDate(this.state.from.toDate(),
      this.props.setOrders(orders);
      // this.setState({ analyticsOrders });
      console.log(`from ${this.state.from} to ${this.state.to} dates`);
    }
  }

  setDate = (type, date) => {
    this.setState(() => {
      return { [type]: date };
    });
    to =  moment(),
    from = moment("2017-10-03")
    const orders = this.props.FetchDataWithDate(this.state.from.toDate(), this.state.to.toDate());
    this.props.setOrders(orders);
  }

  // onsecondDateChange = (date) => {
  //   this.setState({ secondDate: date });
  //   // this.props.getSecondDate(date);
  // }

  onFirstDatePickerFocus = ({ focused }) => {
    // console.log(focused);
    this.setState({ firstDatePickerFocus: focused });
  }
  onSecondDatePickerFocus = ({ focused }) => {
    // console.log(focused);
    this.setState({ secondDatePickerFocus: focused });
  }

  render() {
    const {
      to,
      from,
      firstDatePickerFocus,
      secondDatePickerFocus
    } = this.state;
    console.log(this.state, this.props);
    return (
      <div className="date-picker-wrapper">
        <div className="date-picker">
          <p>From:</p>
          <SingleDatePicker
            numberOfMonths={1}
            isOutsideRange={() => false}
            onDateChange={(val) => this.setDate("from", val)}
            onFocusChange={this.onFirstDatePickerFocus}
            focused={firstDatePickerFocus}
            date={from}
          />
        </div>
        <div className="date-picker">
          <p>To:</p>
          <SingleDatePicker
            numberOfMonths={1}
            isOutsideRange={() => false}
            onDateChange={(val) => this.setDate("to", val)}
            onFocusChange={this.onSecondDatePickerFocus}
            focused={secondDatePickerFocus}
            date={to}
          />
        </div>
      </div>
    );
  }
}

DatePicker.defaultProps = {
  initialEndDate: null,
  initialStartDate: null
};

DatePicker.propTypes = {
  getFirstDate: PropTypes.func,
  getSecondDate: PropTypes.func,
  initialEndDate: PropTypes.any,
  initialStartDate: PropTypes.any
};

registerComponent("DatePicker", DatePicker);
export default DatePicker;
