import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Icon, Input, Button, PageHeader, Alert } from 'antd';

@connect(({ login }) => ({ login }))
@Form.create()
class RegForm extends React.Component {
  static propTypes = {
    changeState: propTypes.func,
  };

  static defaultProps = {
    changeState(state) {},
  };

  state = {
    errMsg: '',
  };
  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      errMsg: '',
    });

    const { form, dispatch } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }

      dispatch({
        type: 'user/register',
        payload: {
          userName: formData.userName,
          password: formData.password,
        },
      }).catch(err => {
        this.setState({
          errMsg: err.message,
        });
      });
    });
  };

  handleLogin = e => {
    e.preventDefault();
    this.props.changeState({
      isLoginMode: true,
    });
  };

  render() {
    const { errMsg } = this.state;
    const { form } = this.props;
    return (
      <Form className="login-form" onSubmit={this.handleSubmit}>
        <PageHeader title="注册" subTitle="后台管理系统" />
        <Form.Item>
          {form.getFieldDecorator('userName', {
            rules: [
              {
                required: true,
                message: '请输入用户名',
              },
            ],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="请输入用户名"
            />,
          )}
        </Form.Item>
        <Form.Item>
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
        <Form.Item>
          {form.getFieldDecorator('password2', {
            rules: [
              {
                required: true,
                validator(rule, value, cb) {
                  if (!value) {
                    return cb(new Error('请确认密码'));
                  }
                  const password = form.getFieldValue('password');
                  if (password !== value) {
                    return cb(new Error('两次输入密码不一致'));
                  }
                  return cb();
                },
              },
            ],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="请确认密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            注册
          </Button>
          <div>
            已有账号？ <a onClick={this.handleLogin}>去登陆 </a>
          </div>
          {errMsg && <Alert showIcon type="error" closable message={errMsg} />}
        </Form.Item>
      </Form>
    );
  }
}

export default RegForm;
