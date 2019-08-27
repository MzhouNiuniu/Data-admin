import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

class HighDatePicker extends React.Component {
  value = null;

  onChange = (momentVal, val) => {
    this.value = momentVal;
    this.props.onChange && this.props.onChange(val);
  };

  render() {
    const props = { ...this.props };
    if (!this.value) {
      if (props.value) {
        this.value = moment(props.value);
      }
    }
    Object.assign(props, {
      value: this.value,
      onChange: this.onChange,
    });

    return <DatePicker {...props} />;
  }
}

export default HighDatePicker;
