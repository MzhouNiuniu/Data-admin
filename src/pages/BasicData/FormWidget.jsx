import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, message, Select } from 'antd';
import YearPicker from '@components/Form/DatePicker/YearPicker';
import Area from '@components/Form/Area';

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

      /* 生成地区信息 */
      {
        const { area } = formData;
        delete formData.area;
        formData.province = area[0];
        formData.city = area[1];
        formData.district = area[2];
      }

      const { dispatch } = this.props;
      if (!this.props.id) {
        dispatch({
          type: 'basicData/create',
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
          type: 'basicData/update',
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
        type: 'basicData/detail',
        payload: this.props.id,
      }).then(res => {
        const formData = res.data && res.data[0];
        if (!formData) {
          message.error('数据不存在');
          this.props.onCancel();
          return;
        }

        /* 生成地区信息 */
        {
          const area = [formData.province, formData.city, formData.district];
          delete formData.province;
          delete formData.city;
          delete formData.district;
          formData.area = area;
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
          <Row>
            <Col span={4}>
              <Form.Item label="年份">
                {form.getFieldDecorator('year', {
                  rules: [
                    {
                      required: true,
                      message: '请选择年份',
                    },
                  ],
                })(<YearPicker placeholder="请选择年份" />)}
              </Form.Item>
            </Col>
            <Col span={7} offset={1}>
              <Form.Item label="地区">
                {form.getFieldDecorator('area', {
                  initialValue: [],
                  rules: [
                    {
                      required: true,
                      message: '请选择地区',
                    },
                  ],
                })(<Area placeholder="请选择地区" useAddress={false} />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="辖区名称">
            {form.getFieldDecorator('directly', {
              rules: [
                {
                  required: true,
                  message: '请选择行政级别',
                },
              ],
            })(
              <Select placeholder="请选择主体评级">
                {['省级', '市级', '区级'].map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="GDP">
            {form.getFieldDecorator('GDP', {
              rules: [
                {
                  required: true,
                  message: '请输入GDP',
                },
              ],
            })(<Input placeholder="请输入GDP" />)}
          </Form.Item>
          <Form.Item label="GDP增速">
            {form.getFieldDecorator('addFDP', {
              rules: [
                {
                  required: true,
                  message: '请输入GDP增速',
                },
              ],
            })(<Input placeholder="请输入GDP增速" />)}
          </Form.Item>
          <Form.Item label="收入">
            {form.getFieldDecorator('income', {
              rules: [
                {
                  required: true,
                  message: '请输入收入',
                },
              ],
            })(<Input placeholder="请输入收入" />)}
          </Form.Item>

          <Form.Item label="增长收入">
            {form.getFieldDecorator('addIncome', {
              rules: [
                {
                  required: true,
                  message: '请输入增长收入',
                },
              ],
            })(<Input placeholder="请输入增长收入" />)}
          </Form.Item>
          <Form.Item label="一般预算">
            {form.getFieldDecorator('budget', {
              rules: [
                {
                  required: true,
                  message: '请输入一般预算',
                },
              ],
            })(<Input placeholder="请输入请输入一般预算" />)}
          </Form.Item>
          <Form.Item label="人口">
            {form.getFieldDecorator('man', {
              rules: [
                {
                  required: true,
                  message: '请输入人口',
                },
              ],
            })(<Input placeholder="请输入请输入人口" />)}
          </Form.Item>
          <Form.Item label="存续债卷余额">
            {form.getFieldDecorator('balance', {
              rules: [
                {
                  required: true,
                  message: '请输入存续债卷余额',
                },
              ],
            })(<Input placeholder="请输入存续债卷余额" />)}
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
