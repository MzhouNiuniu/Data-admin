import React from 'react';
import propTypes from 'prop-types';
import { Button, Col, Icon, Input, InputNumber, Row } from 'antd';

class Income extends React.Component {
  static propsType = {
    value: propTypes.array.isRequired,
    onChange: propTypes.func.isRequired,
  };

  addItem = () => {
    this.props.value.push({
      name: '',
      amount: '',
      per: '',
    });
    this.props.onChange(this.props.value);
  };

  removeItem = index => {
    this.props.value.splice(index, 1);
    this.props.onChange(this.props.value);
  };

  handleChange = (index, key, value) => {
    const item = this.props.value[index];
    item[key] = value;

    this.props.onChange && this.props.onChange(this.props.value);
  };

  render() {
    const queue = this.props.value;

    return (
      <Row gutter={20}>
        {queue.map((item, index) => {
          return (
            <Col key={index} span={6} style={{ position: 'relative' }}>
              <Icon
                style={{
                  position: 'absolute',
                  right: '18px',
                  fontSize: '18px',
                  top: '10px',
                }}
                type="delete"
                onClick={() => this.removeItem(index)}
              />
              <div>
                名称 &ensp;
                <Input
                  style={{ width: '122px' }}
                  value={item.name}
                  onChange={evt => this.handleChange(index, 'name', evt.currentTarget.value)}
                />
              </div>
              <div>
                金额 &ensp;
                <InputNumber
                  value={item.amount}
                  min={0}
                  onChange={val => this.handleChange(index, 'amount', val)}
                />
                &ensp; 亿元
              </div>
              <div>
                占比 &ensp;
                <InputNumber
                  value={item.per}
                  min={0}
                  max={100}
                  onChange={val => this.handleChange(index, 'per', val)}
                />
                &ensp; %
              </div>
            </Col>
          );
        })}
        <Col span={4}>
          <Button type="dashed" onClick={this.addItem} className="hide_disabled">
            <Icon type="plus" />
            添加条目
          </Button>
        </Col>
      </Row>
    );
  }
}

export default Income;
