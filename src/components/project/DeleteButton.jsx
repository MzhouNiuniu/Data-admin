import React from 'react';
import propTypes from 'prop-types';
import { Button, message, Modal } from 'antd';
import request from '@/utils/request';
import Permission from '@components/Permission';

class DeleteButton extends React.Component {
  static propTypes = {
    api: propTypes.string.isRequired,
    row: propTypes.object.isRequired,
    finallyCallback: propTypes.func,
  };

  handleDelItem = () => {
    const { api, row } = this.props;
    Modal.confirm({
      title: '确定要删除这条数据吗？',
      content: row.title,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        request(api, {
          method: 'post',
          data: {
            id: row._id,
          },
        }).then(res => {
          if (res.status !== 200) {
            message.error(res.message);
            return;
          }
          message.success(res.message);
          this.props.finallyCallback && this.props.finallyCallback();
        });
      },
    });
  };

  render() {
    return (
      <Permission permission={['admin']}>
        <Button type="danger" onClick={this.handleDelItem}>
          删除
        </Button>
      </Permission>
    );
  }
}

export default DeleteButton;
