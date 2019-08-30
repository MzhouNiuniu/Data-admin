import React from 'react';
import propTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';

class HighDatePicker extends React.Component {
  static propTypes = {
    value: propTypes.string,
    onChange: propTypes.func,
  };

  value = null;

  onChange = (momentVal, val) => {
    this.value = momentVal;
    this.props.onChange && this.props.onChange(val);
  };

  render() {
    const props = { ...this.props };
    // 回显
    if (!this.value && props.value) {
      this.value = moment(props.value);
    }
    Object.assign(props, {
      value: this.value,
      onChange: this.onChange,
    });

    return <DatePicker {...props} />;
  }
}

export default HighDatePicker;
