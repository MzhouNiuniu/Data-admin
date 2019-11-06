import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Row, Col, Form, Input, Button, message, Select } from 'antd';
import DatePicker from '@components/Form/DatePicker';
import constant from '@constant/index';
import Area from '@components/Form/Area';
import UploadImage from '@components/Form/Upload/Image';
import AuditMessage from '@components/project/AuditMessage';
import InfoManageForm from './InfoManageForm';

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

  $refs = {
    infoManage: null,
  };

  state = {
    auditMessageList: [],
  };
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const infoManageForm = this.$refs.infoManage;
    Promise.all([form.validateFields(), infoManageForm.validateFields()])
      .then(([formData, infoManageFormData]) => {
        Object.assign(formData, infoManageFormData);

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
      })
      .catch(err => {
        console.log(err);
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

        this.setState({
          auditMessageList: formData.auditList,
        });
        this.props.form.setFieldsValue(formData);
      });
    }
  }

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
                message: '请输入经营范围',
              },
            ],
          })(<Input.TextArea rows={4} placeholder="请输入经营范围" />)}
        </Form.Item>
        <Form.Item label="企业图片">
          {form.getFieldDecorator('photos')(
            <UploadImage multiple={true} valueType="string" maxlength={Infinity} />,
          )}
        </Form.Item>
      </>
    );
  };

  render() {
    const { auditMessageList } = this.state;
    const { id, form } = this.props;

    let { preview } = this.props;

    return (
      <>
        <Form className="city-invest__form">
          {!preview && id && <AuditMessage message={auditMessageList} />}
          <fieldset disabled={preview}>{this.renderBaseInfo()}</fieldset>
        </Form>

        <InfoManageForm
          wrappedComponentRef={ref => (this.$refs.infoManage = ref)}
          id={id}
          disabled={preview}
        />

        {!preview ? (
          <div>
            <Button type="primary" onClick={this.handleSubmit}>
              保存
            </Button>
            <span>&emsp;</span>
            <Button onClick={this.props.onCancel}>取消</Button>
          </div>
        ) : null}
      </>
    );
  }
}

export default FormWidget;
