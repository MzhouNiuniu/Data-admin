import React from 'react';
import propTypes from 'prop-types';
import { InputNumber } from 'antd';

export default class IncomeInput extends React.Component {
  static propTypes = {
    value: propTypes.object,
    onChange: propTypes.func,
  };
  static defaultProps = {
    // value: {},
    onChange() {},
  };

  handleChange = val => {
    this.props.onChange({
      ...this.props.value,
      amount: val,
    });
  };
  handleChange2 = val => {
    this.props.onChange({
      ...this.props.value,
      per: val,
    });
  };

  render() {
    const { value } = this.props;

    return (
      <>
        <div>
          金额 &ensp;
          <InputNumber value={value.amount} min={0} onChange={this.handleChange} />
          &ensp; 亿元
        </div>
        <div>
          占比 &ensp;
          <InputNumber value={value.per} min={0} max={100} onChange={this.handleChange2} />
          &ensp; %
        </div>
      </>
    );
  }
}
