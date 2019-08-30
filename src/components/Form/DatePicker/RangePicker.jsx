import React from 'react';
import propTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

class HighRangePicker extends React.Component {
  static propTypes = {
    value: propTypes.array,
    onChange: propTypes.func,
  };

  value = null;

  onChange = (momentVal, val) => {
    this.value = momentVal;
    this.props.onChange && this.props.onChange(val);
  };

  render() {
    const props = { ...this.props, onChange: this.onChange };
    // 回显
    if (!this.value && this.props.value) {
      this.value = [
        !props.value[0] ? null : moment(props.value[0]),
        !props.value[1] ? null : moment(props.value[1]),
      ];
    }
    props.value = this.value;
    return <RangePicker {...props} />;
  }
}

export default HighRangePicker;
