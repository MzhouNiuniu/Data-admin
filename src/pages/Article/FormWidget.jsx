import './Form.scss'
import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'dva'
import Editor from '@components/Editor'
import UploadImageMultiple from '@components/UploadImage'
import {
  Form,
  Input,
  Button,
  message,
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
          type: 'article/create',
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
          type: 'article/update',
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


  reset = () => {
    this.props.form.resetFields()
  }

  componentDidMount() {
    if (this.props.id) {
      const { dispatch } = this.props
      dispatch({
        type: 'article/detail',
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
    const formItemLayout = {
      // labelCol: {span: 24},  // 默认就是这样
      // wrapperCol: {span: 24},  // 默认就是这样
    }

    return (
      <Form onSubmit={this.handlerSubmit}>
        <Form.Item {...formItemLayout} label="文章">
          {form.getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入文章标题',
              },
            ],
          })(<Input placeholder="请输入文章标题"/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="文章内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入文章内容',
              },
            ],
          })(<Editor placeholder="请输入文章内容"/>)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="文章封面">
          {form.getFieldDecorator('picUrl', {
            rules: [
              {
                required: true,
                message: '请上传文章封面',
              },
            ],
          })(<UploadImageMultiple multiple={true}/>)}
        </Form.Item>
        <Form.Item {...formItemLayout}  >
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <span>&emsp;</span>
          <Button onClick={this.props.onCancel}>
            取消
          </Button>
          <span>&emsp;</span>
          <Button onClick={this.reset}>
            reset
          </Button>
        </Form.Item>
      </Form>
    )
  }
}


export default ArticleForm
