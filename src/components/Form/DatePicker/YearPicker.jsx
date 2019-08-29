import React from 'react';
import { DatePicker } from 'antd';
import moment from '@components/Form/DatePicker/index';

class YearPicker extends React.Component {
  value = null;
  state = {
    isOpen: false,
  };

  handlePanelChange = momentVal => {
    this.value = momentVal;
    this.props.onChange && this.props.onChange(momentVal.year());
    this.setState({
      isOpen: false,
    });
  };

  handleOpenChange = isOpen => {
    this.setState({
      isOpen,
    });
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
    });
    delete props.onChange;

    return (
      <DatePicker
        mode="year"
        format="YYYY"
        placeholder="请选择年份"
        open={this.state.isOpen}
        onOpenChange={this.handleOpenChange}
        onPanelChange={this.handlePanelChange}
        {...props}
      />
    );
  }
}

export default YearPicker;
