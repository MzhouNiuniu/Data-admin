import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Form, Button, Select, Input, message, AutoComplete } from 'antd';
import constant from '@constant/index';
import RangePicker from '@components/Form/DatePicker/RangePicker';
import UploadFile from '@components/Form/Upload/File';
import YearPicker from '@components/Form/DatePicker/YearPicker';

@connect()
@Form.create()
class FromWidget extends React.Component {
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

  searchCompanyTimer = null;
  companyDataSource = [];
  state = {
    companyNameDataSource: [], // companyDataSource的简略版，只包含公司名称
  };

  componentDidMount() {
    if (this.props.id) {
      const { dispatch } = this.props;
      dispatch({
        type: 'financial/detail',
        payload: this.props.id,
      }).then(res => {
        const formData = res.data && res.data[0];
        if (!formData) {
          message.error('数据不存在');
          this.props.onCancel();
          return;
        }

        formData.startAndEndTime = [formData.startTime, formData.endTime];
        delete formData.startTime;
        delete formData.endTime;
        this.props.form.setFieldsValue(formData);
      });
    }

    // 测试用
    // this.props.form.setFieldsValue({
    //   'year': 2019,
    //   'DataName': 'JD001',
    //   'financingType': '企业债券',
    //   'code': '11',
    //   'fullName': 'asd',
    //   'abbreviation': '111',
    //   'type': '新区城投',
    //   'issuer': '111',
    //   'issueWay': '111',
    //   'scale': '111',
    //   'startAndEndTime': ['2019-11-10', '2019-12-06'],
    //   'principalUnderwriter': '111',
    //   'deadlineBond': '11',
    //   'payValue': '111',
    //   'rateBond': 'AA+',
    //   'mainType': 'AAA',
    //   'repaymentWay': '111',
    //   'interestWay': '111',
    //   'addEnhancementWay': '111',
    //   'aboutFile': [{
    //     'name': '120.jpg',
    //     'url': 'http://192.168.9.105:3000/upload/2rqCEhLYt.jpg'
    //   }],
    //   'specification': [{
    //     'name': '120.jpg',
    //     'url': 'http://192.168.9.105:3000/upload/yOmMnYAEz.jpg'
    //   }],
    //   'report': [{
    //     'name': '108.png',
    //     'url': 'http://192.168.9.105:3000/upload/cEQv_Q55z.png'
    //   }]
    // });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      errMsg: '',
    });

    const { form, dispatch } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }

      const { startAndEndTime, DataName } = formData;
      delete formData.startAndEndTime;
      if (!startAndEndTime) {
        formData.startTime = formData.endTime = undefined;
      } else {
        formData.startTime = startAndEndTime[0];
        formData.endTime = startAndEndTime[1];
      }

      // 获取当前输入公司的所在地
      const reactComInfo = this.companyDataSource.find(item => item.name === DataName);
      if (!reactComInfo) {
        message.error('系统错误');
        return;
      }
      formData.DataCity = reactComInfo.city; // 测试字段名

      if (!this.props.id) {
        dispatch({
          type: 'financial/create',
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
          type: 'financial/update',
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

          this.props.onClose(formData);
        });
      }
    });
  };

  render() {
    const { form, preview } = this.props;
    const { companyNameDataSource } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <fieldset disabled={preview}>
          <Row gutter={30}>
            <div className="clearfix">
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
              <Col span={6}>
                <Form.Item label="公司名称">
                  {form.getFieldDecorator('DataName', {
                    rules: [
                      {
                        required: true,
                        validator: (rule, value, cb) => {
                          if (!value) {
                            cb(new Error('请输入公司名称'));
                            return;
                          }

                          clearTimeout(this.searchCompanyTimer);
                          this.searchCompanyTimer = setTimeout(() => {
                            this.props
                              .dispatch({
                                type: 'api/searchCompanyByKeywords',
                                payload: value,
                              })
                              .then(res => {
                                this.companyDataSource = (res.data && res.data.docs) || [];
                                this.setState(
                                  {
                                    companyNameDataSource: this.companyDataSource.map(
                                      item => item.name,
                                    ),
                                  },
                                  () => {
                                    if (this.state.companyNameDataSource.includes(value)) {
                                      cb();
                                    } else {
                                      cb(new Error('公司不存在'));
                                    }
                                  },
                                );
                              });
                          }, 250);
                        },
                      },
                    ],
                  })(
                    <AutoComplete
                      placeholder="请输入公司名称"
                      dataSource={companyNameDataSource}
                    />,
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="融资种类">
                  {form.getFieldDecorator('financingType', {
                    rules: [
                      {
                        required: true,
                        message: '请输入融资种类',
                      },
                    ],
                  })(
                    <Select placeholder="请选择融资种类" allowClear>
                      {[
                        '企业债券',
                        '公司债券',
                        '中小企业私募债券',
                        '非公开发行债券',
                        '企业资产支持证券',
                        '信贷资产支持证券',
                        '超短期融资券（SCP）',
                        '短期融资券（CP）',
                        '中期票据（MTN）',
                        '定向工具（PPN）',
                        '资产支持票据（ABN）',
                        '项目收益票据（PRN）',
                        '债务融资工具（DFI）',
                        '绿色债务融资工具（GN）',
                      ].map(item => (
                        <Select.Option key={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              </Col>
            </div>
            <Col span={6}>
              <Form.Item label="债券代码">
                {form.getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请输入债券代码',
                    },
                  ],
                })(<Input placeholder="请输入债券代码" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="债券全称">
                {form.getFieldDecorator('fullName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入债券全称',
                    },
                  ],
                })(<Input placeholder="请输入债券全称" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="债券简称">
                {form.getFieldDecorator('abbreviation', {
                  rules: [
                    {
                      required: true,
                      message: '请输入债券简称',
                    },
                  ],
                })(<Input placeholder="请输入债券简称" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="债券类型">
                {form.getFieldDecorator('type', {
                  rules: [
                    {
                      required: true,
                      message: '请选择债券类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择债券类型">
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
          <Row gutter={30}>
            <Col span={6}>
              <Form.Item label="发行人">
                {form.getFieldDecorator('issuer', {
                  rules: [
                    {
                      required: true,
                      message: '请输入发行人',
                    },
                  ],
                })(<Input placeholder="请输入发行人" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="发行方式">
                {form.getFieldDecorator('issueWay', {
                  rules: [
                    {
                      required: true,
                      message: '请输入发行方式',
                    },
                  ],
                })(<Input placeholder="请输入发行方式" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="发行规模">
                {form.getFieldDecorator('scale', {
                  rules: [
                    {
                      required: true,
                      message: '请输入发行规模',
                    },
                  ],
                })(<Input placeholder="请输入发行规模" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={12}>
              <Form.Item label="起息/到期时间">
                {form.getFieldDecorator('startAndEndTime', {
                  rules: [
                    {
                      required: true,
                      message: '请选择起息/到期时间',
                    },
                  ],
                })(<RangePicker className="w100" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="主承销商">
                {form.getFieldDecorator('principalUnderwriter', {
                  rules: [
                    {
                      required: true,
                      message: '请输入主承销商',
                    },
                  ],
                })(<Input placeholder="请输入主承销商" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={30}>
            <Col span={6}>
              <Form.Item label="债券期限">
                {form.getFieldDecorator('deadlineBond', {
                  rules: [
                    {
                      required: true,
                      message: '请输入债券期限',
                    },
                  ],
                })(<Input placeholder="请输入债券期限" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="票面利率">
                {form.getFieldDecorator('payValue', {
                  rules: [
                    {
                      required: true,
                      message: '请输入票面利率',
                    },
                  ],
                })(<Input placeholder="请输入票面利率" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="债券评级">
                {form.getFieldDecorator('rateBond', {
                  rules: [
                    {
                      required: true,
                      message: '请选择债券评级',
                    },
                  ],
                })(
                  <Select placeholder="请选择债券评级">
                    {constant.cityInvest.rateLevel.map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="主体评级">
                {form.getFieldDecorator('mainType', {
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
          </Row>
          <Row gutter={30}>
            <Col span={6}>
              <Form.Item label="还本方式">
                {form.getFieldDecorator('repaymentWay', {
                  rules: [
                    {
                      required: true,
                      message: '请输入还本方式',
                    },
                  ],
                })(<Input placeholder="请输入还本方式" />)}
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="付息方式">
                {form.getFieldDecorator('interestWay', {
                  rules: [
                    {
                      required: true,
                      message: '请输入付息方式',
                    },
                  ],
                })(<Input placeholder="请输入付息方式" />)}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="增信措施">
            {form.getFieldDecorator('addEnhancementWay', {
              rules: [
                {
                  required: true,
                  message: '请输入增信措施',
                },
              ],
            })(<Input.TextArea rows={4} placeholder="请输入增信措施" />)}
          </Form.Item>
          <Row gutter={30}>
            <Col>
              <Form.Item label="相关文件">
                {form.getFieldDecorator('aboutFile')(<UploadFile multiple={true} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="募集说明书">
                {form.getFieldDecorator('specification')(<UploadFile multiple={true} />)}
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="评级报告">
                {form.getFieldDecorator('report')(<UploadFile multiple={true} />)}
              </Form.Item>
            </Col>
          </Row>
          {!preview && (
            <Form.Item className="text-center">
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

export default FromWidget;
