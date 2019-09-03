import React from 'react';
import propTypes from 'prop-types';
import { Button, Drawer } from 'antd';

class PreviewButton extends React.Component {
  static propTypes = {
    row: propTypes.object,
    FormWidget: propTypes.any, // ReactNode，请示下
  };

  state = {
    visible: false,
  };

  openModal = () => {
    this.setState({
      visible: true,
    });
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible } = this.state;
    const { row, FormWidget } = this.props;
    return (
      <>
        <Button onClick={this.openModal}>查看</Button>
        <span>&emsp;</span>
        {// 减少渲染数量（丧失了过渡效果~）
        visible && (
          <Drawer
            placement="right"
            title="查看详情"
            width={900}
            destroyOnClose
            visible={true}
            onClose={this.closeModal}
          >
            {row && <FormWidget preview id={row._id} />}
          </Drawer>
        )}
      </>
    );
  }
}

export default PreviewButton;
