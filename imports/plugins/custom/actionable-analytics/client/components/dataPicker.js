import React, { Component } from "react";
import { SingleDatePicker } from "react-dates";
import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";

class DatePicker extends Component {
  state = {
    firstDatePickerFocus: false,
    secondDatePickerFocus: false,
    focusedOnDateTwo: false,
    firstDate: this.props.initialStartDate,
    secondDate: this.props.initialEndDate
  }

  onfirstDateChange = (date) => {
    this.setState({ firstDate: date });
    this.props.getFirstDate(date);
  }

  onsecondDateChange = (date) => {
    this.setState({ secondDate: date });
    this.props.getSecondDate(date);
  }

  onFirstDatePickerFocus = ({ focused }) => {
    this.setState({ firstDatePickerFocus: focused });
  }
  onSecondDatePickerFocus = ({ focused }) => {
    this.setState({ secondDatePickerFocus: focused });
  }

  render() {
    const {
      firstDate,
      secondDate,
      firstDatePickerFocus,
      secondDatePickerFocus
    } = this.state;

    return (
      <div className="date-picker-wrapper">
        <div className="date-picker">
          <p>From:</p>
          <SingleDatePicker
            numberOfMonths={1}
            onDateChange={this.onfirstDateChange}
            onFocusChange={this.onFirstDatePickerFocus}
            focused={firstDatePickerFocus}
            date={firstDate}
          />
        </div>
        <div className="date-picker">
          <p>To:</p>
          <SingleDatePicker
            numberOfMonths={1}            
            onDateChange={this.onsecondDateChange}
            onFocusChange={this.onSecondDatePickerFocus}
            focused={secondDatePickerFocus}
            date={secondDate}
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
