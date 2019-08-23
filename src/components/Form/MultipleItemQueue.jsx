import React from 'react';
import propTypes from 'prop-types';
import { Button, Icon } from 'antd';

class MultipleItemQueue extends React.Component {
  static propTypes = {
    disabled: propTypes.bool, // 行为：不展示Add按钮
    length: propTypes.number,
    buttonText: propTypes.string, // 添加按钮的文字
  };

  static defaultProps = {
    disabled: false,
    length: 0,
    buttonText: 'Add',
  };

  state = {
    isInit: false,
    queue: [], // 只是一个队列，不需要实际的值
  };

  componentDidUpdate() {
    if (!this.state.isInit && this.props.length !== 0) {
      this.setState({
        isInit: true,

        queue: Array(this.props.length).fill(1),
      });
    }
  }

  addItem = () => {
    this.state.queue.push(1);
    this.setState({});
  };

  // 默认没有删除功能，因为无法控制slot进来的内容
  removeItem = index => {
    this.state.queue.splice(index, 1);
    this.setState({});
  };

  render() {
    const { queue } = this.state;
    const { children, disabled, buttonText } = this.props;
    if (!children) {
      return null;
    }
    return (
      <section>
        {/**
         * 第二个参数为ctrl，提供addItem、removeItem方法
         * */
        children(queue, this)}
        {disabled && (
          <Button type="dashed" style={{ width: '100%' }} onClick={this.addItem}>
            <Icon type="plus" /> {buttonText}
          </Button>
        )}
      </section>
    );
  }
}

export default MultipleItemQueue;
