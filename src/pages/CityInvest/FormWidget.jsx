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
import UploadFile from '@components/Form/Upload/File';
import AuditMessage from '@components/project/AuditMessage';
import Income from './Income';
import AddBond from './AddBond';

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
    onClose() {},
    onCancel() {},
  };

  state = {
    auditMessageList: [],
    multipleItemQueueLength: {
      financial: 0,
      rate: 0,
      financing: 0,
      incomeInfo: 0,
      other: 0,
    },
    // 用途1：表单验证之后，将每个tab页里面的错误进行统计
    formError: {},
  };
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        this.setState({
          formError: err,
        });
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

        /* 生成地区信息 */
        {
          const area = [formData.province, formData.city, formData.district];
          delete formData.province;
          delete formData.city;
          delete formData.district;
          formData.area = area;
        }

        this.state.multipleItemQueueLength.financial = formData.financial.length;
        this.state.multipleItemQueueLength.rate = formData.rate.length;
        this.state.multipleItemQueueLength.financing = formData.financing.length;

        // todo 临时修复老数据
        if (formData.incomeInfo) {
          this.state.multipleItemQueueLength.incomeInfo = formData.incomeInfo.length;
        }
        this.state.multipleItemQueueLength.other = formData.other.length;

        this.setState(
          {
            auditMessageList: formData.auditList,
          },
          () => {
            setTimeout(() => {
              this.props.form.setFieldsValue(formData);
            }, 0);
          },
        );
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
              <Form.Item label="总资产">
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
            <Col span={6}>
              <Form.Item label="净资产">
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
            <Col span={6}>
              <Form.Item label="负债率">
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
            <Col span={6}>
              <Form.Item label="营业收入额">
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
            <Col span={6}>
              <Form.Item label="主营业务收入">
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
            <Col span={6}>
              <Form.Item label="净利润">
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
            <Col span={6}>
              <Form.Item label="利润总额">
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
                      required: true,
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
                      required: true,
                      message: '请选择展望评级',
                    },
                  ],
                })(
                  <Select placeholder="请选择展望评级">
                    {constant.cityInvest.rateLevel.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={9} offset={1}>
              <Form.Item label="评级机构">
                {form.getFieldDecorator('rate[' + index + '].organization', {
                  rules: [
                    {
                      required: true,
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
                  required: true,
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

  renderBizInfo = (queue, ctrl) => {
    const { form } = this.props;

    /* 融资信息 - financing */
    const selectionYearList = this.getSelectionYearList('financing');
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
                {form.getFieldDecorator('financing[' + index + '].year', {
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
              <Form.Item label="企业债券">
                {form.getFieldDecorator('financing[' + index + '].enterpriseBond')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="公司债券">
                {form.getFieldDecorator('financing[' + index + '].companyBond')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="中小企业私募债券">
                {form.getFieldDecorator('financing[' + index + '].middleBond')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="非公开发行债券">
                {form.getFieldDecorator('financing[' + index + '].unpublicBond')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="企业资产支持证券">
                {form.getFieldDecorator('financing[' + index + '].enterpriseAssetBond')(
                  <AddBond />,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="信贷资产支持证券">
                {form.getFieldDecorator('financing[' + index + '].credit')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="超短期融资券（SCP）">
                {form.getFieldDecorator('financing[' + index + '].SCP')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="短期融资券（CP）">
                {form.getFieldDecorator('financing[' + index + '].CP')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="中期票据（MTN）">
                {form.getFieldDecorator('financing[' + index + '].MTN')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="定向工具（PPN）">
                {form.getFieldDecorator('financing[' + index + '].PPN')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="资产支持票据（ABN）">
                {form.getFieldDecorator('financing[' + index + '].ABN')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="项目收益票据（PRN）">
                {form.getFieldDecorator('financing[' + index + '].PRN')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="债务融资工具（DFI）">
                {form.getFieldDecorator('financing[' + index + '].DFI')(<AddBond />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="绿色债务融资工具（GN）">
                {form.getFieldDecorator('financing[' + index + '].GN')(<AddBond />)}
              </Form.Item>
            </Col>
          </Row>
          {this.renderRemoveItemBtn('financing', index, ctrl.removeItem)}
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
            <Form.Item label="所在地区">
              {form.getFieldDecorator('area', {
                initialValue: [],
                rules: [
                  {
                    required: true,
                    message: '所在地区',
                  },
                ],
              })(<Area placeholder="所在地区" useAddress={false} />)}
            </Form.Item>
          </Col>
          <Col span={4} offset={1}>
            <Form.Item label="所属政府">
              {form.getFieldDecorator('belongGovernment', {
                rules: [
                  {
                    required: true,
                    message: '所属政府',
                  },
                ],
              })(<Input placeholder="所属政府" />)}
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
        {/*<Form.Item label="企业概况">*/}
        {/*{form.getFieldDecorator('info', {*/}
        {/*rules: [*/}
        {/*{*/}
        {/*required: true,*/}
        {/*message: '请输入企业概况',*/}
        {/*},*/}
        {/*],*/}
        {/*})(<Input.TextArea rows={4} placeholder="请输入企业概况" />)}*/}
        {/*</Form.Item>*/}
        <Form.Item label="经营范围">
          {form.getFieldDecorator('businessScope', {
            rules: [
              {
                required: true,
                message: '请输入经营范围',
              },
            ],
          })(<Input.TextArea rows={4} placeholder="请输入经营范围" />)}
        </Form.Item>
        <Form.Item label="企业图片">
          {form.getFieldDecorator('photos')(<UploadImage multiple={true} valueType="string" maxlength={Infinity} />)}
        </Form.Item>
      </>
    );
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
    const { multipleItemQueueLength, auditMessageList } = this.state;
    const { id, form, preview } = this.props;
    console.log(form.getFieldsValue());

    return (

      <Form onSubmit={this.handleSubmit} className="city-invest__form">
        {!preview && id && <AuditMessage message={auditMessageList} />}
        <fieldset disabled={preview}>{this.renderBaseInfo()}</fieldset>
        {/* 此区域不受查看模式影响 */}
        <Form.Item>
          <fieldset disabled={preview}>

          <Tabs  renderTabBar={this.renderTabBar} style={{ pointerEvents: 'auto' }}>

            <Tabs.TabPane forceRender tab="财务信息" key="financial">
              <MultipleItemQueue
              buttonText="添加财务信息"
              queueLength={multipleItemQueueLength.financial}
            >
              {this.renderFinanceInfo}
            </MultipleItemQueue>
            </Tabs.TabPane>
            <Tabs.TabPane forceRender tab="评级信息" key="rate">
              <MultipleItemQueue
                buttonText="添加评级信息"
                queueLength={multipleItemQueueLength.rate}
              >
                {this.renderGradeInfo}
              </MultipleItemQueue>
            </Tabs.TabPane>
            <Tabs.TabPane forceRender tab="营业收入情况" key="incomeInfo">
              <MultipleItemQueue
                buttonText="添加营业收入情况"
                queueLength={multipleItemQueueLength.incomeInfo}
              >
                {this.renderIncomeInfo}
              </MultipleItemQueue>
            </Tabs.TabPane>
            <Tabs.TabPane forceRender tab="其它信息" key="other">
              <MultipleItemQueue
                buttonText="添加其它信息"
                queueLength={multipleItemQueueLength.other}
              >
                {this.renderOtherInfo}
              </MultipleItemQueue>
            </Tabs.TabPane>
          </Tabs>
          </fieldset>
        </Form.Item>

        {!preview?
        <Form.Item>
           < Button type="primary" htmlType="submit">
            保存
            </Button>
            <span>&emsp;</span>
            <Button onClick={this.props.onCancel}>取消</Button>
        </Form.Item>:null}

      </Form>
    );
  }
}

export default FormWidget;
