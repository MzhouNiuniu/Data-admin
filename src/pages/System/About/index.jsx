import React from 'react';
import { Card, Form, Input, Button, message, Icon } from 'antd';
import UploadImage from '@components/Form/Upload/Image';
import MultipleItemQueue from '@components/Form/MultipleItemQueue';
import aboutService from '@services/system/about';

@Form.create()
class About extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (!form.isFieldsTouched()) {
        return;
      }
      aboutService.create(formData).then(res => {
        if (res.status !== 200) {
          message.warn(res.message);
          return;
        }
        message.success(res.message);
      });
    });
  };

  componentDidMount() {}

  removeMultipleItem = (fieldName, index, removeItem) => {
    // 更新表单值
    const { form } = this.props;
    const currentValue = form.getFieldValue(fieldName);
    currentValue.splice(index, 1);
    form.setFieldsValue({
      [fieldName]: currentValue,
    });

    removeItem(index);
  };

  renderAccordion = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 9 },
    };
    return queue.map((item, index) => {
      return (
        <div
          key={index}
          className="pos-rel mb-10 pt-24"
          style={{ border: '1px solid rgb(217, 217, 217)', borderRadius: '4px' }}
        >
          <Form.Item label="公司名称" {...formItemLayout}>
            {form.getFieldDecorator('info[' + index + '].name', {
              rules: [
                {
                  required: true,
                  message: '请输入公司名称',
                },
              ],
            })(<Input placeholder="请输入公司名称" />)}
          </Form.Item>
          <Form.Item label="公司简介" {...formItemLayout}>
            {form.getFieldDecorator('info[' + index + '].name2', {
              rules: [
                {
                  required: true,
                  message: '请输入公司简介',
                },
              ],
            })(<Input.TextArea rows={4} placeholder="请输入公司简介" />)}
          </Form.Item>

          <Icon
            type="close-circle"
            className="pos-abs right-0 top-0 pt-6 pr-6 cursor-pointer"
            style={{ fontSize: '20px' }}
            onClick={() => this.removeMultipleItem('info', index, ctrl.removeItem)}
          />
        </div>
      );
    });
  };

  render() {
    const { form } = this.props;
    return (
      <Card title="关于我们">
        <Form onSubmit={this.handleSubmit} style={{ maxWidth: '1200px' }}>
          <Form.Item label="公司列表">
            <MultipleItemQueue buttonText="添加公司">{this.renderAccordion}</MultipleItemQueue>
          </Form.Item>
          <Form.Item label="资质文件">
            {form.getFieldDecorator('aptitude')(<UploadImage multiple={true} valueType="array" />)}
          </Form.Item>
          <Form.Item className="text-center" wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default About;
