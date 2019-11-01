import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Form, Button, Modal, Select, Input, Card, message } from 'antd';
import constant from '@constant/index';
import RangePicker from '@components/Form/DatePicker/RangePicker';
import UploadFile from '@components/Form/Upload/File';
import LinkButton from '@components/LinkButton';
import YearPicker from '@components/Form/DatePicker/YearPicker';

@connect()
@Form.create({ name: 'bond' })
class BondForm extends React.Component {
  componentDidMount() {
    if (this.props.id) {
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
      console.log(formData);

      if (!this.props.id) {
        dispatch({
          type: 'financial/create',
          payload: formData,
        }).then(res => {
          if (res.status !== 200) {
            message.error(res.message);
            return;
          }
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
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    return (
      <Card>
        <div style={{ maxWidth: '900px' }}>
          <Form onSubmit={this.handleSubmit}>
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
                          message: '请输入公司名称',
                        },
                      ],
                    })(<Input placeholder="请输入公司名称" />)}
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
            <Form.Item className="text-center">
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <span>&emsp;</span>
              <LinkButton to="FinancialList">取消</LinkButton>
            </Form.Item>
          </Form>
        </div>
      </Card>
    );
  }
}

export default BondForm;
