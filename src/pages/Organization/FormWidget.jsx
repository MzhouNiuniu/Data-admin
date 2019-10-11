import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Select, Button, message, Icon } from 'antd';
import Fieldset from '@components/Form/Fieldset';
import MultipleItemQueue from '@components/Form/MultipleItemQueue';
import Area from '@components/Form/Area';
import AuditMessage from '@components/project/AuditMessage';

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

  state = {
    auditMessageList: [],
    multipleItemQueueLength: {
      experience: 0,
    },
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
        formData.address = area[1];
        formData.province = area[0][0];
        formData.city = area[0][1];
        formData.district = area[0][2];
      }

      const { dispatch } = this.props;
      if (!this.props.id) {
        dispatch({
          type: 'organization/create',
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
          type: 'organization/update',
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
        type: 'organization/detail',
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
          const area = [[formData.province, formData.city, formData.district], formData.address];
          delete formData.address;
          delete formData.province;
          delete formData.city;
          delete formData.district;
          formData.area = area;
        }

        // ant.design form，需要先生成node之后，再设置form的数据
        const { multipleItemQueueLength } = this.state;

        if (formData.experience) {
          multipleItemQueueLength.experience = formData.experience.length;
        }
        this.setState({
          auditMessageList: formData.auditList,
        });

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

  renderCooperation = (queue, ctrl) => {
    const { preview, form } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 9 },
    };
    /* 合作经验 - experience */
    return queue.map((item, index) => {
      return (
        <div
          key={index}
          className="pos-rel mb-10 pt-24"
          style={{ border: '1px solid rgb(217, 217, 217)', borderRadius: '4px' }}
        >
          <Form.Item label="项目名称" {...formItemLayout}>
            {form.getFieldDecorator('experience[' + index + '].name', {
              rules: [
                {
                  required: true,
                  message: '请输入项目名称',
                },
              ],
            })(Fieldset.Field(<Input placeholder="请输入项目名称" />))}
          </Form.Item>
          <Form.Item label="项目类型" {...formItemLayout}>
            {form.getFieldDecorator('experience[' + index + '].type', {
              rules: [
                {
                  required: true,
                  message: '请输入项目类型',
                },
              ],
            })(Fieldset.Field(<Input placeholder="请输入项目类型" />))}
          </Form.Item>
          <Form.Item label="合作城投公司名称" {...formItemLayout}>
            {form.getFieldDecorator('experience[' + index + '].companyName', {
              rules: [
                {
                  required: true,
                  message: '请输入合作城投公司名称',
                },
              ],
            })(Fieldset.Field(<Input placeholder="请输入合作城投公司名称" />))}
          </Form.Item>
          {!preview && (
            <Icon
              type="close-circle"
              className="pos-abs right-0 top-0 pt-6 pr-6 cursor-pointer"
              style={{ fontSize: '20px' }}
              onClick={() => this.removeMultipleItem('experience', index, ctrl.removeItem)}
            />
          )}
        </div>
      );
    });
  };

  render() {
    const { multipleItemQueueLength, auditMessageList } = this.state;
    const { id, preview, form } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    };
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{ maxWidth: '1200px' }}>
        {!preview && id && <AuditMessage message={auditMessageList} />}
        <Fieldset disabled={preview}>
          <Form.Item label="机构名称">
            {form.getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入机构名称',
                },
              ],
            })(Fieldset.Field(<Input placeholder="请输入机构名称" />))}
          </Form.Item>
          <Form.Item label="机构网站">
            {form.getFieldDecorator('website', {
              rules: [
                {
                  type: 'url',
                  required: true,
                  message: '请输入机构网站',
                },
              ],
            })(Fieldset.Field(<Input placeholder="请输入机构网站" />))}
          </Form.Item>
          <Form.Item label="所在地">
            {form.getFieldDecorator('area', {
              initialValue: [],
              rules: [
                {
                  required: true,
                  message: '请输入所在地',
                },
              ],
            })(Fieldset.Field(<Area style={{ width: '360px' }} placeholder="请输入所在地" />))}
          </Form.Item>
          <Form.Item label="服务内容">
            {form.getFieldDecorator('service', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: '请输入服务内容',
                },
              ],
            })(Fieldset.Field(<Input.TextArea rows={4} placeholder="请输入服务内容" />))}
          </Form.Item>
          <Form.Item label="经营范围">
            {form.getFieldDecorator('scope', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: '请输入经营范围',
                },
              ],
            })(Fieldset.Field(<Input.TextArea rows={4} placeholder="请输入经营范围" />))}
          </Form.Item>
          <Form.Item label="专业领域">
            {form.getFieldDecorator('speciality', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: '请输入专业领域',
                },
              ],
            })(Fieldset.Field(<Input.TextArea rows={4} placeholder="请输入专业领域" />))}
          </Form.Item>
          <Form.Item label="合作经验">
            <MultipleItemQueue
              disabled={preview}
              buttonText="添加合作经验"
              queueLength={multipleItemQueueLength.experience}
            >
              {this.renderCooperation}
            </MultipleItemQueue>
          </Form.Item>
          <Form.Item label="机构简介">
            {form.getFieldDecorator('intro', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: '请输入机构简介',
                },
                {
                  message: '请输入0 - 500字',
                  min: 0,
                  max: 500,
                },
              ],
            })(Fieldset.Field(<Input.TextArea rows={10} placeholder="请输入机构简介" />))}
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
        </Fieldset>
      </Form>
    );
  }
}

export default FormWidget;
