import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import {connect} from 'dva';
import {Row, Col, Form, Input, Button, message, Select} from 'antd';
import UploadFile from '@components/Form/Upload/File';
import Editor from '@components/Form/Editor';
import AuditMessage from '@components/project/AuditMessage';
import constant from '@constant';
import UploadImage from '@components/Form/Upload/Image';

@connect()
@Form.create()
class FormWidget extends React.Component {
  editor = null;
  static propTypes = {
    preview: propTypes.bool, // 是否为预览模式
    id: propTypes.oneOfType([propTypes.string, propTypes.number]),
    onClose: propTypes.func,
    onCancel: propTypes.func,
  };

  state = {
    auditMessageList: [],
  };

  static defaultProps = {
    onClose() {
    },
    onCancel() {
    },
  };

  handleSubmit = e => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      if (!form.isFieldsTouched()) {
        this.props.onCancel();
        return;
      }
      // 提取图片
      const {dispatch} = this.props;
      if (!this.props.id) {
        dispatch({
          type: 'professionReport/create',
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
          type: 'professionReport/update',
          payload: {
            id: this.props.id,
            status: 0,
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
      const {dispatch} = this.props;
      dispatch({
        type: 'professionReport/detail',
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
    const {auditMessageList} = this.state;
    const {id, form, preview} = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        {!preview && id && <AuditMessage message={auditMessageList}/>}
        <fieldset disabled={preview}>
          <Row>
            <Col span={19}>
              <Form.Item label="标题">
                {form.getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标题',
                    },
                  ],
                })(<Input placeholder="请输入标题"/>)}
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
                    {constant.profession.report.type.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col >
              <Form.Item label="封面">
                {form.getFieldDecorator('cover', {
                  rules: [
                    {
                      message: '请上传封面',
                    },
                  ],
                })(<UploadImage valueType="string"/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <Form.Item label="研究人">
                {form.getFieldDecorator('human', {
                  rules: [
                    {
                      required: true,
                      message: '请输入研究人',
                    },
                  ],
                })(<Input placeholder="请输入研究人"/>)}
              </Form.Item>
            </Col>
            <Col span={19} offset={1}>
              <Form.Item label="研究人所属机构">
                {form.getFieldDecorator('organization', {
                  rules: [
                    {
                      required: true,
                      message: '请输入研究人所属机构',
                    },
                  ],
                })(<Input placeholder="请输入研究人所属机构"/>)}
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="简介">
            {form.getFieldDecorator('brief', {
              rules: [
                {
                  required: true,
                  message: '请输入简介',
                },
              ],
            })(<Input.TextArea placeholder="请输入简介"/>)}
          </Form.Item>
          <Form.Item label="内容">
            {form.getFieldDecorator('content', {
              rules: [
                {
                  required: true,
                  message: '请输入内容',
                },
              ],
            })(
              <Editor
                ref={ref => (this.editor = ref)}
                disabled={preview}
                placeholder="请输入内容"
              />,
            )}
          </Form.Item>
          <Form.Item label="附件">
            {form.getFieldDecorator('accessory')(<UploadFile multiple={true}/>)}
          </Form.Item>
          {!preview && (
            <Form.Item>
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
