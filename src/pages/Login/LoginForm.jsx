import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Form, Icon, Input, Button, Checkbox, PageHeader, Alert } from 'antd';

@withRouter
@connect(({ login }) => ({ login }))
@Form.create()
class LoginForm extends React.Component {
  static propTypes = {
    changeState: propTypes.func,
  };

  static defaultProps = {
    changeState(state) {},
  };

  state = {
    errMsg: '',
    autoLogin: true,
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
      const { autoLogin } = this.state;
      dispatch({
        type: 'user/login',
        payload: formData,
        autoLogin,
        redirect: this.props.location.query.redirect,
      }).catch(err => {
        this.setState({
          errMsg: err.message,
        });
      });
    });
  };

  handleRegister = e => {
    e.preventDefault();
    this.props.changeState({
      isLoginMode: false,
    });
  };
  handleAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  render() {
    const { errMsg, autoLogin } = this.state;
    const { form } = this.props;
    return (
      <Form className="login-form" onSubmit={this.handleSubmit}>
        <PageHeader title="DDD" subTitle="后台管理系统" />
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
          <div>
            <Checkbox checked={autoLogin} onChange={this.handleAutoLogin}>
              自动登陆
            </Checkbox>
            {null && (
              <a style={{ float: 'right' }} onClick={this.handleRegister}>
                新用户注册{' '}
              </a>
            )}
          </div>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          {errMsg && <Alert showIcon type="error" closable message={errMsg} />}
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;
