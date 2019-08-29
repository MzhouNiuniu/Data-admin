import React from 'react';
import { Card, Form, Input, Button, message, Icon } from 'antd';
import UploadImage from '@components/Form/Upload/Image';
import frontService from '@services/system/front';

@Form.create()
class About extends React.Component {
  state = {
    disabled: false,
  };
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
      frontService.updateIndexConfig(formData).then(res => {
        if (res.status !== 200) {
          message.error(res.message);
          return;
        }
        message.success(res.message);
      });
    });
  };

  componentDidMount() {
    frontService.indexConfigDetail().then(res => {
      if (res.status !== 200) {
        message.error(res.message);
        this.setState({ disabled: true });
        return;
      }

      this.props.form.setFieldsValue(res.data);
    });
  }

  render() {
    const { disabled } = this.state;
    const { form } = this.props;
    return (
      <Card title="前台配置">
        <Form onSubmit={this.handleSubmit} style={{ maxWidth: '1200px' }}>
          <Form.Item label="轮播图">
            {form.getFieldDecorator('banner', {
              rules: [
                {
                  required: true,
                  message: '请上传轮播图',
                },
              ],
            })(<UploadImage multiple={true} valueType="array" maxlength={Infinity} />)}
          </Form.Item>
          {!disabled && (
            <Form.Item className="text-center" wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    );
  }
}

export default About;
