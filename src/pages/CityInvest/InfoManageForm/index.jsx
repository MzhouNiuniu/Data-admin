import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, message, Select, Tabs, Icon } from 'antd';
import YearPicker from '@components/Form/DatePicker/YearPicker';
import MultipleItemQueue from '@components/Form/MultipleItemQueue';
import constant from '@constant/index';
import UploadFile from '@components/Form/Upload/File';
import Income from './Income';

@connect()
@Form.create()
class InfoManage extends React.Component {
  static propTypes = {
    id: propTypes.oneOfType([propTypes.string, propTypes.number]),
    disabled: propTypes.bool,
  };
  static defaultProps = {
    disabled: false,
  };

  state = {
    // 用途1：表单验证之后，将每个tab页里面的错误进行统计
    formError: {},

    multipleItemQueueLength: {
      financial: 0,
      rate: 0,
      financing: 0,
      incomeInfo: 0,
      other: 0,
    },
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
          return;
        }

        this.state.multipleItemQueueLength.financial = formData.financial.length;
        this.state.multipleItemQueueLength.rate = formData.rate.length;
        this.state.multipleItemQueueLength.financing = formData.financing.length;
        this.state.multipleItemQueueLength.incomeInfo = formData.incomeInfo.length;
        this.state.multipleItemQueueLength.other = formData.other.length;

        this.setState({}, () => {
          setTimeout(() => {
            this.props.form.setFieldsValue(formData);
          }, 0);
        });
      });
    }
  }

  validateFields = () => {
    this.setState({
      formError: {},
    });
    return this.props.form.validateFields().catch(err => {
      this.setState({
        formError: err.errors,
      });
      return Promise.reject(err);
    });
  };

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
    return (
      <Icon
        type="close-circle"
        className="pos-abs right-0 top-0 pt-6 pr-6 cursor-pointer"
        style={{ fontSize: '20px' }}
        onClick={() => this.removeMultipleItem(fieldName, index, removeItem)}
      />
    );
  };

  getFieldsValue = fieldName => {
    // 解决 getFieldsValue(fieldName)
    return this.props.form.getFieldsValue()[fieldName];
  };

  getSelectionYearList = fieldName => {
    const currentValue = this.getFieldsValue(fieldName);
    if (!Array.isArray(currentValue)) {
      return [];
    }
    return currentValue.reduce((acc, item) => {
      item.year && acc.push(Number(item.year));
      return acc;
    }, []);
  };

  renderFinanceInfo = (queue, ctrl) => {
    const { form } = this.props;

    /* 财务信息 - financial */
    const selectionYearList = this.getSelectionYearList('financial');
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
          <Row gutter={30}>
            <Col span={6}>
              <Form.Item label="年份">
                {form.getFieldDecorator('financial[' + index + '].year', {
                  rules: [
                    {
                      required: true,
                      message: '请选择年份',
                    },
                  ],
                })(<YearPicker disabledYearList={selectionYearList} />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="总资产（亿元）">
                {form.getFieldDecorator('financial[' + index + '].totalAsset', {
                  rules: [
                    {
                      message: '请输入总资产',
                    },
                  ],
                })(<Input placeholder="请输入总资产" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="净资产（亿元）">
                {form.getFieldDecorator('financial[' + index + '].netAsset', {
                  rules: [
                    {
                      message: '请输入净资产',
                    },
                  ],
                })(<Input placeholder="请输入净资产（亿元）" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="负债率（%）">
                {form.getFieldDecorator('financial[' + index + '].liabilities', {
                  rules: [
                    {
                      message: '请输入负债率',
                    },
                  ],
                })(<Input placeholder="请输入负债率" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="营业收入额（亿元）">
                {form.getFieldDecorator('financial[' + index + '].business', {
                  rules: [
                    {
                      message: '请输入营业收入',
                    },
                  ],
                })(<Input placeholder="请输入营业收入" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="主营业务收入（亿元）">
                {form.getFieldDecorator('financial[' + index + '].mainBusiness', {
                  rules: [
                    {
                      message: '请输入主营业务收入',
                    },
                  ],
                })(<Input placeholder="请输入主营业务收入" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="净利润（亿元）">
                {form.getFieldDecorator('financial[' + index + '].netProfit', {
                  rules: [
                    {
                      message: '请输入净利润',
                    },
                  ],
                })(<Input placeholder="请输入净利润" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="利润总额（亿元）">
                {form.getFieldDecorator('financial[' + index + '].totalProfit', {
                  rules: [
                    {
                      message: '请输入利润总额',
                    },
                  ],
                })(<Input placeholder="请输入利润总额" />)}
              </Form.Item>
            </Col>
          </Row>
          {this.renderRemoveItemBtn('financial', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderGradeInfo = (queue, ctrl) => {
    const { form } = this.props;

    /* 评级信息 - rate */
    const selectionYearList = this.getSelectionYearList('rate');
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
                {form.getFieldDecorator('rate[' + index + '].year', {
                  rules: [
                    {
                      required: true,
                      message: '请选择年份',
                    },
                  ],
                })(<YearPicker disabledYearList={selectionYearList} />)}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="主体评级">
                {form.getFieldDecorator('rate[' + index + '].main', {
                  rules: [
                    {
                      message: '请选择主体评级',
                    },
                  ],
                })(
                  <Select placeholder="请选择主体评级">
                    {constant.cityInvest.rateLevel.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={4} offset={1}>
              <Form.Item label="展望评级">
                {form.getFieldDecorator('rate[' + index + '].wish', {
                  rules: [
                    {
                      message: '请输入展望评级',
                    },
                  ],
                })(<Input placeholder="请输入展望评级" />)}
              </Form.Item>
            </Col>
            <Col span={9} offset={1}>
              <Form.Item label="评级机构">
                {form.getFieldDecorator('rate[' + index + '].organization', {
                  rules: [
                    {
                      message: '请输入评级机构',
                    },
                  ],
                })(<Input placeholder="请输入评级机构" />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="评级报告">
            {form.getFieldDecorator('rate[' + index + '].report', {
              rules: [
                {
                  message: '请输入评级报告',
                },
              ],
            })(<Input.TextArea rows={4} placeholder="请输入评级报告" />)}
          </Form.Item>
          {this.renderRemoveItemBtn('rate', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderIncomeInfo = (queue, ctrl) => {
    const { form } = this.props;

    /* 营业收入 - incomeInfo */
    const selectionYearList = this.getSelectionYearList('incomeInfo');
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
          <Form.Item label="年份" labelCol={{ span: 2 }} wrapperCol={{ span: 6 }} labelAlign="left">
            {form.getFieldDecorator('incomeInfo[' + index + '].year', {
              rules: [
                {
                  required: true,
                  message: '请选择年份',
                },
              ],
            })(<YearPicker disabledYearList={selectionYearList} />)}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('incomeInfo[' + index + '].data', {
              initialValue: [],
            })(<Income />)}
          </Form.Item>
          {this.renderRemoveItemBtn('incomeInfo', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderOtherInfo = (queue, ctrl) => {
    const { form } = this.props;
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
          <Form.Item label="上传附件">
            {form.getFieldDecorator('other[' + index + ']', {
              rules: [
                {
                  required: true,
                  message: '请上传附件',
                },
              ],
            })(<UploadFile />)}
          </Form.Item>
          {this.renderRemoveItemBtn('other', index, ctrl.removeItem)}
        </div>
      );
    });
  };

  renderTabBar = (props, DefaultTabBar) => {
    const { formError } = this.state;
    return (
      <DefaultTabBar {...props}>
        {node => {
          if (formError[node.key]) {
            return React.cloneElement(node, {
              style: {
                color: 'red',
                fontWeight: 'bold',
              },
            });
          }
          return node;
        }}
      </DefaultTabBar>
    );
  };

  render() {
    const { multipleItemQueueLength } = this.state;
    const { disabled } = this.props;

    const tabStyle = {
      // maxHeight: '600px',
      // overflowY: 'auto'
    };

    return (
      <Form>
        <fieldset disabled={disabled}>
          <Form.Item>
            <Tabs renderTabBar={this.renderTabBar} style={{ pointerEvents: 'auto' }}>
              <Tabs.TabPane forceRender tab="财务信息" key="financial" style={tabStyle}>
                <MultipleItemQueue
                  disabled={disabled}
                  buttonText="添加财务信息"
                  queueLength={multipleItemQueueLength.financial}
                >
                  {this.renderFinanceInfo}
                </MultipleItemQueue>
              </Tabs.TabPane>
              <Tabs.TabPane forceRender tab="评级信息" key="rate" style={tabStyle}>
                <MultipleItemQueue
                  disabled={disabled}
                  buttonText="添加评级信息"
                  queueLength={multipleItemQueueLength.rate}
                >
                  {this.renderGradeInfo}
                </MultipleItemQueue>
              </Tabs.TabPane>
              <Tabs.TabPane forceRender tab="营业收入情况" key="incomeInfo" style={tabStyle}>
                <MultipleItemQueue
                  disabled={disabled}
                  buttonText="添加营业收入情况"
                  queueLength={multipleItemQueueLength.incomeInfo}
                >
                  {this.renderIncomeInfo}
                </MultipleItemQueue>
              </Tabs.TabPane>
              <Tabs.TabPane forceRender tab="其它信息" key="other" style={tabStyle}>
                <MultipleItemQueue
                  disabled={disabled}
                  buttonText="添加其它信息"
                  queueLength={multipleItemQueueLength.other}
                >
                  {this.renderOtherInfo}
                </MultipleItemQueue>
              </Tabs.TabPane>
            </Tabs>
          </Form.Item>
        </fieldset>
      </Form>
    );
  }
}

export default InfoManage;
