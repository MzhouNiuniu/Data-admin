import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

class HighDatePicker extends React.Component {
  render() {
    const props = { ...this.props };
    if (props.value && typeof props.value !== 'object') {
      props.value = moment(props.value);
    }
    return <DatePicker {...props} />;
  }
}

export default HighDatePicker;
