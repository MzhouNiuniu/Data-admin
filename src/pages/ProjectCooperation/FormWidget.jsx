import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import UploadFile from '@components/Form/Upload/File';
import UploadImage from '@components/Form/Upload/Image';

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
  message,
} from 'antd';
import Editor from '@components/Form/Editor';
import AuditMessage from '@components/project/AuditMessage';
import constant from '@constant/index';

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

@connect()
@Form.create({
  name: 'ProjCooForm',
})
class ProjCooForm extends React.Component {
  static propTypes = {
    id: propTypes.oneOfType([propTypes.string, propTypes.number]),
    onClose: propTypes.func,
    onCancel: propTypes.func,
  };

  static defaultProps = {
    onClose() {},
    onCancel() {},
  };

  state = {
    auditMessageList: [],
    confirmDirty: false,
    loading: false,
  };
  editor = null;
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, formData) => {
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
          type: 'ProjectCooperation/create',
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
          type: 'ProjectCooperation/update',
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

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageUrl => {
        console.log(imageUrl);
        this.setState({
          imageUrl,
          loading: false,
        });
      });
    }
  };

  componentDidMount() {
    if (this.props.id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'ProjectCooperation/detail',
        payload: this.props.id,
      }).then(res => {
        const formData = res.data && res.data[0];
        if (!formData) {
          message.error('数据不存在');
          this.props.onCancel();
          return;
        }

        this.setState({
          auditMessageList: formData.auditList,
        });
        this.props.form.setFieldsValue(formData);
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { auditMessageList } = this.state;
    const { id, preview, form } = this.props;
    const formItemLayout = {};
    const tailFormItemLayout = {};

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    return (
      <>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          {!preview && id && <AuditMessage message={auditMessageList} />}
          <Row>
            <Col span={19}>
              <Form.Item label="项目名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入项目名称',
                    },
                  ],
                })(<Input disabled={preview} />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="类型">
                {form.getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择类型">
                    {constant.ProjectCooperation.projectType.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="公司名称">
            {getFieldDecorator('company', {
              rules: [
                {
                  required: true,
                  message: '请输入公司名称',
                },
              ],
            })(<Input disabled={preview} />)}
          </Form.Item>

          <Form.Item label="推广公司">
            {getFieldDecorator('Tcompany')(<Input disabled={preview} />)}
          </Form.Item>

          <Form.Item label="推广联系方式">
            {getFieldDecorator('Tcontact')(<Input disabled={preview} />)}
          </Form.Item>

          <Form.Item label="内容">
            {getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: '请输入内容',
                },
              ],
            })(
              <Editor
                disabled={preview}
                ref={ref => (this.editor = ref)}
                placeholder="请输入内容"
              />,
            )}
          </Form.Item>

          <Form.Item label="附件">
            {getFieldDecorator('accessory')(
              <UploadFile disabled={preview} multiple={true} valueType="array"></UploadFile>,
            )}
          </Form.Item>

          <Form.Item label="二维码">
            {getFieldDecorator('Tphotos')(<UploadImage disabled={preview} />)}
          </Form.Item>
          {!preview && (
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          )}
        </Form>
      </>
    );
  }
}

export default ProjCooForm;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
