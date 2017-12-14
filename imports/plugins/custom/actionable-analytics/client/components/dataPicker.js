import React, { Component } from "react";
import { SingleDatePicker } from "react-dates";
import PropTypes from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";

class DatePicker extends Component {
  state = {
    firstDatePickerFocus: false,
    secondDatePickerFocus: false,
    to: null,
    from: null
  }

  setToDate = (date) => {
    this.setState({ to: date });
    this.props.getSelectedDate(this.state.from.toDate(), date.toDate());
  }
  setFromDate = (date) => {
    this.setState({ from: date });
    this.props.getSelectedDate(date.toDate(), this.state.to.toDate());
  }


  onFirstDatePickerFocus = ({ focused }) => {
    this.setState({ firstDatePickerFocus: focused });
  }

  onSecondDatePickerFocus = ({ focused }) => {
    this.setState({ secondDatePickerFocus: focused });
  }

  render() {
    const {
      to,
      from,
      firstDatePickerFocus,
      secondDatePickerFocus
    } = this.state;

    return (
      <div className="date-picker-wrapper">
        <div className="date-picker">
          <p>From:</p>
          <SingleDatePicker
            numberOfMonths={1}
            keepOpenOnDateSelect={false}
            isOutsideRange={() => false}
            onDateChange={this.setFromDate}
            onFocusChange={this.onFirstDatePickerFocus}
            focused={firstDatePickerFocus}
            date={from}
          />
        </div>
        <div className="date-picker">
          <p>To:</p>
          <SingleDatePicker
            numberOfMonths={1}
            keepOpenOnDateSelect={false}
            isOutsideRange={() => false}
            onDateChange={this.setToDate}
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
  getSelectedDate: PropTypes.func,
  initialEndDate: PropTypes.any,
  initialStartDate: PropTypes.any
};

registerComponent("DatePicker", DatePicker);
export default DatePicker;
