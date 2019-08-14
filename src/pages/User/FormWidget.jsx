import './Form.scss'
import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'dva'
import UploadImageMultiple from '@components/UploadImage'
import {
  Form,
  Input,
  Button,
  message, Icon,
} from 'antd'

@connect()
@Form.create()
class ArticleForm extends React.Component {
  static propTypes = {
    id: propTypes.oneOfType([propTypes.string, propTypes.number]),
    onClose: propTypes.func,
    onCancel: propTypes.func,
  }

  static defaultProps = {
    onClose() {
    },
    onCancel() {
    },
  }

  handlerSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, formData) => {
      if (err) {
        return
      }
      if (!form.isFieldsTouched()) {
        message.warn('表单未操作')
        this.props.onCancel()
        return
      }
      const { dispatch } = this.props
      if (!this.props.id) {
        dispatch({
          type: 'user/create',
          payload: formData,
        })
          .then(res => {
            if (res.code !== 200) {
              message.warn(res.message)
              return
            }
            this.props.onClose()
          })
      } else {
        dispatch({
          type: 'user/update',
          id: this.props.id,
          payload: formData,
        })
          .then(res => {
            if (res.code !== 200) {
              message.warn(res.message)
              return
            }
            this.props.onClose(formData) // 编辑时将最新数据发送出去
          })
      }
    })
  }

  componentDidMount() {
    if (this.props.id) {
      const { dispatch } = this.props
      dispatch({
        type: 'user/detail',
        payload: this.props.id,
      })
        .then(res => {
          if (!res.data) {
            message.error('文章不存在')
            this.props.onCancel()
            return
          }
          delete res.data.id
          this.props.form.setFieldsValue(res.data)
        })
    }
  }

  render() {
    const { form } = this.props

    return (
      <Form onSubmit={this.handlerSubmit}>
        <Form.Item label="用户名">
          {form.getFieldDecorator('phone', {
            rules: [{
              required: true,
              message: 'Please input your phone!'
            }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              placeholder="Phone"
            />,
          )}
        </Form.Item>
        <Form.Item label="用户密码">
          {form.getFieldDecorator('password', {
            rules: [{
              required: true,
              message: 'Please input your Password!'
            }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item label="用户头像">
          {form.getFieldDecorator('avatar')(<UploadImageMultiple/>)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <span>&emsp;</span>
          <Button onClick={this.props.onCancel}>
            取消
          </Button>
        </Form.Item>
      </Form>
    )
  }
}


export default ArticleForm
