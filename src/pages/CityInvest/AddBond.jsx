import React from 'react';
import propTypes from 'prop-types';
import { Row, Col, Form, Button, Modal, Select, Input } from 'antd';
import constant from '@constant/index';
import RangePicker from '@components/Form/DatePicker/RangePicker';
import UploadFile from '@components/Form/Upload/File';
import BondRecordManage from './BondRecordManage';
import BraftEditor from 'braft-editor';

@Form.create({ name: 'bond' })
class BondForm extends React.Component {
  static propTypes = {
    value: propTypes.object,
    onSubmit: propTypes.func.isRequired,
    onCancel: propTypes.func.isRequired,
  };

  componentDidMount() {
    if (this.props.value) {
      this.props.form.setFieldsValue(this.props.value);
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSubmit(this.props.form);
  };

  render() {
    const { form } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row gutter={30}>
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
        <Form.Item className="text-right">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <span>&emsp;</span>
          <Button onClick={this.props.onCancel}>取消</Button>
        </Form.Item>
      </Form>
    );
  }
}

class AddBond extends React.Component {
  static propTypes = {
    value: propTypes.object,
    onChange: propTypes.func,
  };
  isInit = false;
  state = {
    visible: false,
    records: [], // 每种债券都有记录
  };

  componentDidUpdate(prevProps, prevState) {
    // 初始化
    if (!this.isInit && this.props.value) {
      this.isInit = true;
      this.setState({
        records: this.props.value.record,
      });
    }
  }

  setRecords = records => {
    this.props.value.record = records;
    this.setState({
      records,
    });
  };
  handleOpenModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCloseModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = form => {
    form.validateFields((err, formData) => {
      if (err) {
        // console.info('表单验证状态为：关闭');
        this.props.onChange(undefined);
        return;
      }

      const { startAndEndTime } = formData;
      delete formData.startAndEndTime;
      if (!startAndEndTime) {
        formData.startTime = formData.endTime = undefined;
      } else {
        formData.startTime = startAndEndTime[0];
        formData.endTime = startAndEndTime[1];
      }

      // 因为无法嵌套的层级，只能手动添加债券记录，例如：form.getFieldDecorator('financing[' + index + '].enterpriseBond.record')
      formData.record = this.state.records;

      this.props.onChange(formData);
      this.handleCloseModal();
    });
  };

  render() {
    const { visible, records } = this.state;
    let { value } = this.props;
    if (value) {
      value = { ...this.props.value };
      value.startAndEndTime = [value.startTime, value.endTime];
      delete value.startTime;
      delete value.endTime;
    }
    return (
      <>
        {!value ? (
          <>
            <div className="text-disabled">未设置</div>
            <div className="hide_disabled">
              <Button type="dashed" size="small" onClick={this.handleOpenModal}>
                添加
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>{value.fullName || value.abbreviation}</div>
            <div className="hide_disabled">
              <Button type="primary" size="small" onClick={this.handleOpenModal}>
                编辑
              </Button>
              <span>&nbsp;</span>
              <BondRecordManage records={records} setRecords={this.setRecords} />
            </div>
          </>
        )}
        <Modal
          destroyOnClose
          visible={visible}
          footer={null}
          width="950px"
          onCancel={this.handleCloseModal}
        >
          <BondForm value={value} onSubmit={this.handleSubmit} onCancel={this.handleCloseModal} />
        </Modal>
      </>
    );
  }
}

export default AddBond;
