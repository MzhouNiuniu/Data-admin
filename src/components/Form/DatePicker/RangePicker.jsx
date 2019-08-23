import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;

class HighRangePicker extends React.Component {
  render() {
    const props = { ...this.props };
    if (!Array.isArray(props.value)) {
      props.value = [];
      if (this.props.onChange) {
        setTimeout(() => {
          this.props.onChange(props.value);
        });
        return null;
      }
    } else {
      if (props.value[0]) {
        props.value[0] = moment(props.value[0]);
      }
      if (props.value[1]) {
        props.value[1] = moment(props.value[1]);
      }
    }
    return <RangePicker {...props} />;
  }
}

export default HighRangePicker;
