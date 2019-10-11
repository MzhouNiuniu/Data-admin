import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import UploadImage from '@components/Form/Upload/Image';
import { Form, Input, Button, message, Icon, Select } from 'antd';
import { withRouter } from 'dva/router';
@withRouter
@connect()
@Form.create()
class FormWidget extends React.Component {
  static propTypes = {
    id: propTypes.oneOfType([propTypes.string, propTypes.number]),
    onClose: propTypes.func,
    onCancel: propTypes.func,
  };

  static defaultProps = {
    onClose() {},
    onCancel() {},
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (!form.isFieldsTouched()) {
        this.props.onCancel();
        return;
      }
      const { dispatch } = this.props;
      if (!this.props.location.query.id) {
        dispatch({
          type: 'user/create',
          payload: formData,
        }).then(res => {
          if (res.status !== 200) {
            message.error(res.message);
            return;
          }
          this.props.onClose();
        });
      } else {
        console.log(Object.assign({ id: this.props.location.query.id }, formData));
        dispatch({
          type: 'user/updateById',
          id: this.props.location.query.id,
          payload: Object.assign({ id: this.props.location.query.id }, formData),
        }).then(res => {
          if (res.status !== 200) {
            message.error(res.message);
            return;
          }
          this.props.onClose(formData); // 编辑时将最新数据发送出去
        });
      }
    });
  };

  componentDidMount() {
    console.log(this.props);
    if (this.props.location.query.id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/detail',
        payload: this.props.location.query.id,
      }).then(res => {
        if (!res.data) {
          message.error('数据不存在');
          this.props.onCancel();
          return;
        }
        delete res.data.id;
        this.props.form.setFieldsValue(res.data);
      });
    }
  }

  render() {
    console.log(this.props);
    const { form } = this.props;
    const roleList = [{ label: '用户', value: 'user' }, { label: '管理员', value: 'admin' }];

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="头像" className="mb-6">
          {form.getFieldDecorator('logo')(<UploadImage />)}
        </Form.Item>
        <Form.Item label="账号">
          {form.getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入账号',
              },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入账号"
            />,
          )}
        </Form.Item>
        <Form.Item label="密码">
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请输入密码"
            />,
          )}
        </Form.Item>
        <Form.Item label="角色">
          {form.getFieldDecorator('role', {
            rules: [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          })(
            <Select placeholder="请选择类型">
              {roleList.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <span>&emsp;</span>
          <Button onClick={this.props.onCancel}>取消</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default FormWidget;
