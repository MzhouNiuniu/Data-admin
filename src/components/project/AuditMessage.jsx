import React from 'react';
import propTypes from 'prop-types';
import { Timeline, Button, Modal, Alert } from 'antd';
import Permission from '@components/Permission';

class AuditMessage extends React.Component {
  static propTypes = {
    message: propTypes.array,
  };
  static defaultProps = {
    message: [],
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
    const { message } = this.props;

    return (
      <section>
        <Alert
          message={
            <>
              审核未通过！
              <Button size="small" type="link" onClick={this.openModal}>
                查看详情
              </Button>
            </>
          }
          type="warning"
          showIcon
        />
        <Modal destroyOnClose visible={visible} footer={null} onCancel={this.closeModal}>
          <Timeline style={{ marginBottom: '-44px' }} reverse={true}>
            {message.map((item, index) => (
              <Timeline.Item key={index} color="red">
                <p>{item.releaseTime}</p>
                <p>{item.message}</p>
              </Timeline.Item>
            ))}
          </Timeline>
        </Modal>
      </section>
    );
  }
}

export default AuditMessage;
