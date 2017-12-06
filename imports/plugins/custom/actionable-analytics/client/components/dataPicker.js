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

  onDateChange = (date) => {
    this.setState({ date });
  }

  onFirstDatePickerFocus = ({ focused }) => {
    this.setState({ firstDatePickerFocus: focused });
  }
  onSecondDatePickerFocus = ({ focused }) => {
    this.setState({ secondDatePickerFocus: focused });
  }

  render() {
    const {
      date,
      firstDatePickerFocus,
      secondDatePickerFocus
    } = this.state;

    return (
      <div className="col-12">
        <div className="col-6">
          <p>From</p>
          <SingleDatePicker
            onDateChange={this.onDateChange}
            onFocusChange={this.onFirstDatePickerFocus}
            focused={firstDatePickerFocus}
            date={date}
          />
        </div>
        <div className="col-6">
          <p>From</p>
          <SingleDatePicker
            onDateChange={this.onDateChange}
            onFocusChange={this.onSecondDatePickerFocus}
            focused={secondDatePickerFocus}
            date={date}
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
  initialEndDate: PropTypes.any,
  initialStartDate: PropTypes.any
};

registerComponent("DatePicker", DatePicker);
export default DatePicker;
