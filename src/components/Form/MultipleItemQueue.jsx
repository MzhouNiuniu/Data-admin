import React from 'react';
import propTypes from 'prop-types';
import { Button, Icon } from 'antd';

class MultipleItemQueue extends React.Component {
  static propTypes = {
    disabled: propTypes.bool, // 行为：不展示Add按钮
    queueLength: propTypes.number,
    buttonText: propTypes.string, // 添加按钮的文字
    queueItemGetter: propTypes.func, // 向queue设置数据，默认用不到，queue其实可以使用数字代替
  };

  static defaultProps = {
    disabled: false,
    queueLength: 0,
    buttonText: 'Add',
    queueItemGetter() {
      return 1;
    },
  };

  isInit = false;
  state = {
    queue: [],
  };

  componentDidUpdate() {
    if (!this.isInit && this.props.queueLength !== 0) {
      const queue = [];
      for (let i = 0; i < this.props.queueLength; i++) {
        queue.push(this.props.queueItemGetter());
      }
      this.isInit = true;
      this.setState({
        queue,
      });
    }
  }

  addItem = () => {
    const { queue } = this.state;
    queue.push(this.props.queueItemGetter());
    this.setState({});
  };

  // 默认没有删除功能，因为无法控制slot进来的内容
  removeItem = index => {
    const { queue } = this.state;
    queue.splice(index, 1);
    this.setState({});
  };

  getQueue = () => {
    return this.queue;
  };

  render() {
    const { queue } = this.state;
    const { children, disabled, buttonText } = this.props;
    if (!children) {
      return null;
    }
    // 第二个参数为ctrl，提供addItem、removeItem、getQueue方法（暂时直接将组件实例暴露了出去）
    return (
      <section>
        {children(queue, this)}
        {!disabled && (
          // global.less，通过hide_disabled实现通过css禁用
          <Button
            type="dashed"
            style={{ width: '100%' }}
            onClick={this.addItem}
            className="hide_disabled"
          >
            <Icon type="plus" /> {buttonText}
          </Button>
        )}
      </section>
    );
  }
}

export default MultipleItemQueue;
