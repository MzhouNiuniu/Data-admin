import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, message, Select } from 'antd';
import Editor from '@components/Form/Editor';
import constant from '@constant/index';

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
          type: 'policy/create',
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
          type: 'policy/update',
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
        type: 'policy/detail',
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
              })(<Input placeholder="请输入标题" />)}
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
                  {constant.policy.type.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="文号">
          {form.getFieldDecorator('reference', {
            rules: [
              {
                required: true,
                message: '请输入文号',
              },
            ],
          })(<Input placeholder="请输入文号" />)}
        </Form.Item>

        <Form.Item label="内容">
          {form.getFieldDecorator('content', {
            rules: [
              {
                required: true,
                message: '请输入内容',
              },
            ],
          })(<Editor placeholder="请输入内容" />)}
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
