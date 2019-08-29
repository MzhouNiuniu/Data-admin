import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import {
    Card,
    Form,
    Input,
    Tooltip,
    Icon,
    Cascader,
    Select,
    Row,
    Col,
    Checkbox,
    Button,
    AutoComplete,
    Upload,
    message
  } from 'antd';
  import Editor from '@components/Form/Editor';

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

class RegistrationForm extends React.Component {
  state = {
    confirmDirty: false,
  };
  editor = null;
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
        // labelCol: { span: 4 },
        // wrapperCol: { span: 17 },
    };
    const tailFormItemLayout = {
    //   wrapperCol: {
    //     xs: {
    //       span: 24,
    //       offset: 0,
    //     },
    //     sm: {
    //       span: 16,
    //       offset: 8,
    //     },
    //   },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} >
        <Form.Item label="项目名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入项目名称',
              }
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="内容">
          {getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入内容',
              },
            ],
          })(<Editor ref={ref => (this.editor = ref)} placeholder="请输入内容" />)}
        </Form.Item>

        <Form.Item label="附件">
          {getFieldDecorator('accessory', {
            rules: [
              {
                required: true,
                message: '请上传',
              },
            ],
          })(<Upload {...props}>
            <Button>
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>)}
        </Form.Item>
        <Form.Item label="测试框">
          {getFieldDecorator('test', {
            rules: [
              {
                required: true,
                message: '请输入',
              },
            ],
          })(<input type="file" />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={() => {
              console.log(this.props.form.getFieldsValue())
          }} >测试数据</Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

@connect()
class AddProjCoo extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Card>
                <div>
                    <WrappedRegistrationForm/>
                </div>
            </Card>
        )
    }
}

export default AddProjCoo;