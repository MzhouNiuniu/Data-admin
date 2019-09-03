import React from 'react';
import propTypes from 'prop-types';
import { Form, Button, Modal, message, Input, Dropdown, Icon, Menu } from 'antd';
import request from '@/utils/request';
import Permission from '@components/Permission';
import LinkButton from '@components/LinkButton';

const RejectForm = Form.create({ name: 'audit' })(function(props) {
  const { form, onSubmit, onCancel } = props;
  return (
    <>
      <Form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(form);
        }}
      >
        <Form.Item label="驳回原因">
          {form.getFieldDecorator('message', {
            rules: [
              {
                required: true,
                message: '请输入驳回原因',
              },
            ],
          })(<Input.TextArea rows={4} placeholder="请输入驳回原因" />)}
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <span>&emsp;</span>
          <Button onClick={onCancel}>取消</Button>
        </div>
      </Form>
    </>
  );
});
RejectForm.propTypes = {
  onSubmit: propTypes.func,
  onCancel: propTypes.func,
};

class AuditButton extends React.Component {
  static propTypes = {
    api: propTypes.string.isRequired,
    row: propTypes.object.isRequired,
    status: propTypes.oneOfType([propTypes.string.isRequired, propTypes.number.isRequired]),
    onResolve: propTypes.func,
    onReject: propTypes.func,
    finallyCallback: propTypes.func,
  };

  state = {
    visible: false,
  };

  handleClickResolveBtn = () => {
    Modal.confirm({
      title: '确定审核通过吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { row, api } = this.props;
        request(api, {
          method: 'post',
          data: {
            id: row._id,
            status: 1,
          },
        }).then(res => {
          if (res.status !== 200) {
            message.error(res.message);
            return;
          }
          message.success(res.message);
          this.props.onResolve && this.props.onResolve();
          this.props.finallyCallback && this.props.finallyCallback();
        });
      },
    });
  };

  openRejectForm = () => {
    this.setState({
      visible: true,
    });
  };
  closeRejectForm = () => {
    this.setState({
      visible: false,
    });
  };

  handleRejectFormSubmit = form => {
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }

      const { row, api } = this.props;
      request(api, {
        method: 'post',
        data: {
          id: row._id,
          status: 2,
          ...formData,
        },
      }).then(res => {
        if (res.status !== 200) {
          message.error(res.message);
          return;
        }
        message.success(res.message);
        this.closeRejectForm();
        this.props.onReject && this.props.onReject();
        this.props.finallyCallback && this.props.finallyCallback();
      });
    });
  };

  render() {
    const { visible } = this.state;
    const { row } = this.props;
    const status = Number(this.props.status);

    // 审核通过不显示
    if (status === 1) {
      return null;
    }

    // 审核不通过 显示编辑按钮
    const menu = (
      <Menu>
        <Menu.Item key="resolve" onClick={this.handleClickResolveBtn}>
          通过
        </Menu.Item>
        <Menu.Item key="reject" onClick={this.openRejectForm}>
          不通过
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <Permission permission={['admin']}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Button className="info">
              审核
              <Icon type="down-circle" theme="twoTone" />
            </Button>
          </Dropdown>
          <span>&emsp;</span>
          <Modal destroyOnClose visible={visible} footer={null} onCancel={this.closeRejectForm}>
            <RejectForm onSubmit={this.handleRejectFormSubmit} onCancel={this.closeRejectForm} />
          </Modal>
        </Permission>
        {status === 2 && (
          <>
            <LinkButton type="primary" to={`Form/${row._id}`}>
              编辑
            </LinkButton>
            <span>&emsp;</span>
          </>
        )}
      </>
    );
  }
}

export default AuditButton;
