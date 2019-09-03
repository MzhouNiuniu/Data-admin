import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Button, message } from 'antd';
import Editor from '@components/Form/Editor';

@connect()
@Form.create()
class FormWidget extends React.Component {
  editor = null;
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
      // 提取图片
      formData.cover = this.editor.getFirstImage();
      const { dispatch } = this.props;
      if (!this.props.id) {
        dispatch({
          type: 'professionCase/create',
          payload: formData,
        }).then(res => {
          if (res.status !== 200) {
            message.error(res.message);
            return;
          }
          this.props.onClose();
        });
      } else {
        dispatch({
          type: 'professionCase/update',
          id: this.props.id,
          payload: {
            id: this.props.id,
            ...formData,
          },
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
    console.log(this.editor);
    if (this.props.id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'professionCase/detail',
        payload: this.props.id,
      }).then(res => {
        const formData = res.data && res.data[0];
        if (!formData) {
          message.error('数据不存在');
          this.props.onCancel();
          return;
        }

        this.props.form.setFieldsValue(formData);
      });
    }
  }

  render() {
    const { form } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="标题">
          {form.getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入标题',
              },
            ],
          })(<Input placeholder="请输入标题" />)}
        </Form.Item>
        <Form.Item label="简介">
          {form.getFieldDecorator('brief', {
            rules: [
              {
                required: true,
                message: '请输入简介',
              },
            ],
          })(<Input.TextArea placeholder="请输入简介" />)}
        </Form.Item>
        <Form.Item label="内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入内容',
              },
            ],
          })(<Editor ref={ref => (this.editor = ref)} placeholder="请输入内容" />)}
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
