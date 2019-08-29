import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, message, Select, Tabs, Icon } from 'antd';
import DatePicker from '@components/Form/DatePicker';
import YearPicker from '@components/Form/DatePicker/YearPicker';
import MultipleItemQueue from '@components/Form/MultipleItemQueue';
import constant from '@constant/index';
import Area from '@components/Form/Area';
import UploadImage from '@components/Form/Upload/Image';

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
          type: 'cityInvest/create',
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
          type: 'cityInvest/update',
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
        type: 'cityInvest/detail',
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

  renderRemoveItemBtn = (fieldName, index, removeItem) => {
    if (this.props.preview) return null;
    return (
      <Icon
        type="close-circle"
        className="pos-abs right-0 top-0 pt-6 pr-6 cursor-pointer"
        style={{ fontSize: '20px' }}
        onClick={() => this.removeMultipleItem(fieldName, index, removeItem)}
      />
    );
  };

  renderFinanceInfo = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {};
    /* 财务信息 - financial */
    return queue.map((item, index) => {
      return (
        <div
          key={index}
          className="pos-rel mb-10 pt-24"
          style={{
            border: '1px solid rgb(217, 217, 217)',
            borderRadius: '4px',
            padding: ' 0 10px',
          }}
        >
          <Row>
            <Col span={4}>
              <Form.Item label="年份">
                {form.getFieldDecorator('financial[' + index + '].year', {
                  rules: [
                    {
                      required: true,
                      message: '请选择年份',
                    },
                  ],
                })(<YearPicker />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="总资产" {...formItemLayout}>
                {form.getFieldDecorator('financial[' + index + '].totalAsset', {
                  rules: [
                    {
                      required: true,
                      message: '请输入总资产',
                    },
                  ],
                })(<Input placeholder="请输入总资产" />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="净资产" {...formItemLayout}>
                {form.getFieldDecorator('financial[' + index + '].netAsset', {
                  rules: [
                    {
                      required: true,
                      message: '请输入净资产',
                    },
                  ],
                })(<Input placeholder="请输入净资产" />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="负债率" {...formItemLayout}>
                {form.getFieldDecorator('financial[' + index + '].liabilities', {
                  rules: [
                    {
                      required: true,
                      message: '请输入负债率',
                    },
                  ],
                })(<Input placeholder="请输入负债率" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={4}>
              <Form.Item label="营业收入额" {...formItemLayout}>
                {form.getFieldDecorator('financial[' + index + '].business', {
                  rules: [
                    {
                      required: true,
                      message: '请输入营业收入',
                    },
                  ],
                })(<Input placeholder="请输入营业收入" />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="主营业务收入" {...formItemLayout}>
                {form.getFieldDecorator('financial[' + index + '].mainBusiness', {
                  rules: [
                    {
                      required: true,
                      message: '请输入主营业务收入',
                    },
                  ],
                })(<Input placeholder="请输入主营业务收入" />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="净利润" {...formItemLayout}>
                {form.getFieldDecorator('financial[' + index + '].netProfit', {
                  rules: [
                    {
                      required: true,
                      message: '请输入净利润',
                    },
                  ],
                })(<Input placeholder="请输入净利润" />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="利润总额" {...formItemLayout}>
                {form.getFieldDecorator('financial[' + index + '].totalProfit', {
                  rules: [
                    {
                      required: true,
                      message: '请输入利润总额',
                    },
                  ],
                })(<Input placeholder="请输入利润总额" />)}
              </Form.Item>
            </Col>
          </Row>
          {this.renderRemoveItemBtn('finance', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderGradeInfo = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {};
    /* 评级信息 - grade */
    return queue.map((item, index) => {
      return (
        <div
          key={index}
          className="pos-rel mb-10 pt-24"
          style={{
            border: '1px solid rgb(217, 217, 217)',
            borderRadius: '4px',
            padding: ' 0 10px',
          }}
        >
          <Form.Item label="字段名" {...formItemLayout}>
            {form.getFieldDecorator('grade[' + index + '].字段名', {
              rules: [
                {
                  required: true,
                  message: '请输入字段名',
                },
              ],
            })(<Input placeholder="请输入字段名" />)}
          </Form.Item>

          {this.renderRemoveItemBtn('grade', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderBizInfo = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {};
    /* 融资信息 - biz */
    return queue.map((item, index) => {
      return (
        <div
          key={index}
          className="pos-rel mb-10 pt-24"
          style={{
            border: '1px solid rgb(217, 217, 217)',
            borderRadius: '4px',
            padding: ' 0 10px',
          }}
        >
          <Form.Item label="字段名" {...formItemLayout}>
            {form.getFieldDecorator('biz[' + index + '].字段名', {
              rules: [
                {
                  required: true,
                  message: '请输入字段名',
                },
              ],
            })(<Input placeholder="请输入字段名" />)}
          </Form.Item>

          {this.renderRemoveItemBtn('biz', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderOtherInfo = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {};
    /* 其它信息 - other */
    return queue.map((item, index) => {
      return (
        <div
          key={index}
          className="pos-rel mb-10 pt-24"
          style={{
            border: '1px solid rgb(217, 217, 217)',
            borderRadius: '4px',
            padding: ' 0 10px',
          }}
        >
          <Form.Item label="字段名" {...formItemLayout}>
            {form.getFieldDecorator('other[' + index + '].字段名', {
              rules: [
                {
                  required: true,
                  message: '请输入字段名',
                },
              ],
            })(<Input placeholder="请输入字段名" />)}
          </Form.Item>

          {this.renderRemoveItemBtn('other', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderBaseInfo = () => {
    const { form } = this.props;
    return (
      <>
        <Row>
          <Col span={6}>
            <Form.Item label="公司名称">
              {form.getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入公司名称',
                  },
                ],
              })(<Input placeholder="请输入公司名称" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="成立日期">
              {form.getFieldDecorator('creationTime', {
                rules: [
                  {
                    required: true,
                    message: '请选择成立日期',
                  },
                ],
              })(<DatePicker placeholder="请选择成立日期" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="注册资本">
              {form.getFieldDecorator('registerCapital', {
                rules: [
                  {
                    required: true,
                    message: '请输入注册资本',
                  },
                ],
              })(<Input placeholder="请输入注册资本" />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="实际控制人">
              {form.getFieldDecorator('controllerMan', {
                rules: [
                  {
                    required: true,
                    message: '请输入实际控制人',
                  },
                ],
              })(<Input placeholder="请输入实际控制人" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item label="所属政府">
              {form.getFieldDecorator('area', {
                initialValue: [],
                rules: [
                  {
                    required: true,
                    message: '请选择所属政府',
                  },
                ],
              })(<Area placeholder="请选择所属政府" useAddress={false} />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="行政级别">
              {form.getFieldDecorator('level', {
                rules: [
                  {
                    required: true,
                    message: '请选择行政级别',
                  },
                ],
              })(
                <Select placeholder="请选择行政级别">
                  {constant.cityInvest.govLevel.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="主体类型">
              {form.getFieldDecorator('mainType', {
                rules: [
                  {
                    required: true,
                    message: '请选择主体类型',
                  },
                ],
              })(
                <Select placeholder="请选择主体类型">
                  {constant.cityInvest.mainType.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="企业概况">
          {form.getFieldDecorator('info', {
            rules: [
              {
                required: true,
                message: '请输入企业概况',
              },
            ],
          })(<Input.TextArea rows={4} placeholder="请输入企业概况" />)}
        </Form.Item>
        <Form.Item label="企业图片">
          {form.getFieldDecorator('photos')(<UploadImage multiple={true} maxlength={Infinity} />)}
        </Form.Item>
      </>
    );
  };

  render() {
    const { form } = this.props;
    console.log(form.getFieldsValue());
    return (
      <Form onSubmit={this.handleSubmit} className="city-invest__form">
        {this.renderBaseInfo()}
        <Form.Item>
          <Tabs>
            <Tabs.TabPane tab="财务信息" key="baseInfo">
              <MultipleItemQueue buttonText="ADD">{this.renderFinanceInfo}</MultipleItemQueue>
            </Tabs.TabPane>
            <Tabs.TabPane tab="评级信息" key="financeInfo">
              <MultipleItemQueue buttonText="ADD">{this.renderGradeInfo}</MultipleItemQueue>
            </Tabs.TabPane>
            <Tabs.TabPane tab="融资信息" key="bizInfo">
              <MultipleItemQueue buttonText="ADD">{this.renderBizInfo}</MultipleItemQueue>
            </Tabs.TabPane>
            <Tabs.TabPane tab="其它信息" key="otherInfo">
              <MultipleItemQueue buttonText="ADD">{this.renderOtherInfo}</MultipleItemQueue>
            </Tabs.TabPane>
          </Tabs>
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