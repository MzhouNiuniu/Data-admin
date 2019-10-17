import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Button, message, Select } from 'antd';
import UploadImage from '@components/Form/Upload/Image';

@connect()
@Form.create()
class FormWidget extends React.Component {
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
          type: 'magazine/create',
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
          type: 'magazine/update',
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
    if (this.props.id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'magazine/detail',
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
      <Form onSubmit={this.handleSubmit} style={{ maxWidth: '1200px' }}>
        <fieldset disabled={preview}>
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
          {/*<Form.Item label="链接">*/}
          {/*{form.getFieldDecorator('url', {*/}
          {/*rules: [*/}
          {/*{*/}
          {/*type: 'url',*/}
          {/*required: true,*/}
          {/*message: '请输入链接',*/}
          {/*},*/}
          {/*],*/}
          {/*})(<Input placeholder="请输入链接" />)}*/}
          {/*</Form.Item>*/}
          <Form.Item label="封面">
            {form.getFieldDecorator('photos', {
              rules: [
                {
                  required: true,
                  message: '请上传封面',
                },
              ],
            })(<UploadImage />)}
          </Form.Item>
          {!preview && (
            <Form.Item className="text-center" wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <span>&emsp;</span>
              <Button onClick={this.props.onCancel}>取消</Button>
            </Form.Item>
          )}
        </fieldset>
      </Form>
    );
  }
}

export default FormWidget;
