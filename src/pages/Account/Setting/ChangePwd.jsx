import './index.scss'
import React from 'react'
import { connect } from 'dva'
import {
  Form,
  Icon,
  Input,
  Button,
  Alert,
} from 'antd'

@connect()
@Form.create()
class ChangePwd extends React.Component {
  state = {
    errMsg: '',
  }
  handlerSubmit = e => {
    e.preventDefault()
    this.setState({
      errMsg: '',
    })

    const { form, dispatch } = this.props
    form.validateFields((err, formData) => {
      if (err) {
        return
      }

      dispatch({
        type: 'user/changePwd',
        payload: {
          password: formData.newPassword,
        },
      })
        .catch(err => {
          this.setState({
            errMsg: err.message,
          })
        })
    })
  }

  render() {
    const { errMsg } = this.state
    const { form } = this.props
    return (
      <Form onSubmit={this.handlerSubmit}>
        <Form.Item>
          {form.getFieldDecorator('oldPassword', {
            rules: [{
              required: true,
              message: '请输入旧密码'
            }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="请输入旧密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator('newPassword', {
            rules: [{
              required: true,
              message: '请输入新密码'
            }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="请输入新密码"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {form.getFieldDecorator('newPassword2', {
            rules: [{
              required: true,
              validator(rule, value, cb) {
                if (!value) {
                  return cb(new Error('请确认新密码'))
                }
                const newPassword = form.getFieldValue('newPassword')
                const oldPassword = form.getFieldValue('oldPassword')
                if (newPassword !== value) {
                  return cb(new Error('两次输入新密码不一致'))
                }
                if (oldPassword === value) {
                  return cb(new Error('新密码与旧密码相同'))
                }
                return cb()
              },
            }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="请确认新密码"
            />,
          )}
        </Form.Item>
        <div>
          {
            errMsg &&
            <Alert banner type="error" closable message={errMsg}
                   style={{ 'marginBottom': '10px' }}/>
          }
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    )
  }
}


export default ChangePwd
