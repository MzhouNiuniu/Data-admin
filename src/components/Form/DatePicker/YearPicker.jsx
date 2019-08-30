import React from 'react';
import propTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from '@components/Form/DatePicker/index';

// todo 无法禁用年
class YearPicker extends React.Component {
  static propTypes = {
    value: propTypes.oneOfType([propTypes.string, propTypes.number]),
    disabledDate: propTypes.oneOfType([propTypes.func, propTypes.array]), // 原组件需要传一个函数，这里做优化允许传入一个数组
    onChange: propTypes.func,
  };
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
    props.value = this.value;

    if (Array.isArray(props.disabledDate)) {
      props.disabledDate = momentVal => {
        console.log(this.props.disabledDate, momentVal.year());
        // console.log(this.props.disabledDate.includes(momentVal.year()));
        return true;
      };
    }

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
