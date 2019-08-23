import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import Editor from '@components/Form/Editor';
import { Form, Input, Button, message } from 'antd';

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
      if (!this.props.id) {
        dispatch({
          type: 'news/create',
          payload: formData,
        }).then(res => {
          if (res.status !== 200) {
            message.warn(res.message);
            return;
          }
          this.props.onClose();
        });
      } else {
        dispatch({
          type: 'news/update',
          id: this.props.id,
          payload: {
            id: this.props.id,
            ...formData,
          },
        }).then(res => {
          if (res.status !== 200) {
            message.warn(res.message);
            return;
          }
          this.props.onClose(formData); // 编辑时将最新数据发送出去
        });
      }
    });
  };

  componentDidMount() {
    if (this.props.id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'news/detail',
        payload: this.props.id,
      }).then(res => {
        const formData = res.data && res.data[0];
        if (!formData) {
          message.error('数据不存在');
          this.props.onCancel();
          return;
        }

        this.props.form.setFieldsValue({
          title: formData.title,
          content: formData.content,
        });
      });
    }
  }

  render() {
    const { form } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="文章">
          {form.getFieldDecorator('title', {
            rules: [
              {
                required: true,
                message: '请输入文章标题',
              },
            ],
          })(<Input placeholder="请输入文章标题" />)}
        </Form.Item>
        <Form.Item label="文章内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入文章内容',
              },
            ],
          })(<Editor placeholder="请输入文章内容" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <span>&emsp;</span>
          <Button onClick={this.props.onCancel}>取消</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default FormWidget;
