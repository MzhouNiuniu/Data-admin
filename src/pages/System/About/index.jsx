import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Form, Input, Button, message } from 'antd';
import UploadImage from '@components/Form/Upload/Image';

@connect()
@Form.create()
class About extends React.Component {
  static propTypes = {
    preview: propTypes.bool, // 是否为预览模式
    id: propTypes.oneOfType([propTypes.string, propTypes.number]),
    onClose: propTypes.func,
    onCancel: propTypes.func,
  };

  static defaultProps = {
    preview: false,
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
          type: 'expert/create',
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
          type: 'expert/update',
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
        type: 'expert/detail',
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
    const { preview, form } = this.props;
    return (
      <Card title="关于我们">
        <Form onSubmit={this.handleSubmit} style={{ maxWidth: '1200px' }}>
          <fieldset disabled={preview}>
            <Form.Item label="城投联络会">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入城投联络会',
                  },
                  {
                    max: 400,
                  },
                ],
              })(<Input.TextArea rows={4} placeholder="请输入城投联络会" />)}
            </Form.Item>
            <Form.Item label="中国投资咨询">
              {form.getFieldDecorator('current', {
                validateTrigger: ['onBlur'],
                rules: [
                  {
                    required: true,
                    message: '请输入中国投资咨询',
                  },
                  {
                    max: 400,
                  },
                ],
              })(<Input.TextArea rows={4} placeholder="请输入中国投资咨询" />)}
            </Form.Item>
            <Form.Item label="智慧城投介绍">
              {form.getFieldDecorator('experience', {
                validateTrigger: ['onBlur'],
                rules: [
                  {
                    required: true,
                    message: '请输入智慧城投介绍',
                  },
                  {
                    max: 400,
                  },
                ],
              })(<Input.TextArea rows={4} placeholder="请输入智慧城投介绍" />)}
            </Form.Item>
            <Form.Item label="资质文件（智慧城投的文件）">
              {form.getFieldDecorator('attachment')(<UploadImage multiple={true} />)}
            </Form.Item>
            {!preview && (
              <Form.Item className="text-center" wrapperCol={{ span: 24 }}>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <span>&emsp;</span>
                <Button onClick={this.props.onCancel}>取消</Button>
              </Form.Item>
            )}
          </fieldset>
        </Form>
      </Card>
    );
  }
}

export default About;
