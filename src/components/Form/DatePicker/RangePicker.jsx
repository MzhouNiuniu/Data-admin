/**
 * 未完成！
 * 未完成！
 * 未完成！
 * */
import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

class HighRangePicker extends React.Component {
  value = [];

  onChange = (momentVal, val) => {
    this.value = momentVal;
    this.props.onChange && this.props.onChange(val);
  };

  render() {
    const props = { ...this.props, onChange: this.onChange, value: this.value };
    if (!Array.isArray(props.value)) {
      setTimeout(() => {
        this.onChange(null, []);
      });
      return null;
    }
    //
    // else {
    //   props.value = [
    //     !props.value[0] ? null : moment(props.value[0]),
    //     !props.value[1] ? null : moment(props.value[1]),
    //   ]
    // }

    return <RangePicker {...props} />;
  }
}

export default HighRangePicker;
