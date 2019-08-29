import './Form.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Input, Button, message, Select, Icon } from 'antd';
import constant from '@constant';

import UploadImageMultiple from '@components/Form/UploadImage';
import MultipleItemQueue from '@components/Form/MultipleItemQueue';
import DatePicker from '@components/Form/DatePicker';
import RangePicker from '@components/Form/DatePicker/RangePicker';

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
    multipleItemQueueLength: {
      languages: 0,
      professional: 0,
      registered: 0,
      achievement: 0,
    },
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
          type: 'expert/create',
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
          type: 'expert/update',
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
        type: 'expert/detail',
        payload: this.props.id,
      }).then(res => {
        const formData = res.data && res.data[0];
        if (!formData) {
          message.error('数据不存在');
          this.props.onCancel();
          return;
        }

        // ant.design form，需要先生成node之后，再设置form的数据
        const { multipleItemQueueLength } = this.state;

        if (formData.languages) {
          multipleItemQueueLength.languages = formData.languages.length;
        }
        if (formData.professional) {
          multipleItemQueueLength.professional = formData.professional.length;
        }
        if (formData.registered) {
          multipleItemQueueLength.registered = formData.registered.length;
        }
        if (formData.achievement) {
          multipleItemQueueLength.achievement = formData.achievement.length;
        }
        this.setState({});

        this.props.form.setFieldsValue(formData);
      });
    }
  }

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
  renderExpertTeah = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 9 },
    };
    /* 专业技术职称 - professional */
    return queue.map((item, index) => (
      <div
        key={index}
        className="pos-rel mb-10 pt-24"
        style={{ border: '1px solid rgb(217, 217, 217)', borderRadius: '4px' }}
      >
        <Form.Item label="名称" {...formItemLayout}>
          {form.getFieldDecorator('professional[' + index + '].name', {
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
        <Form.Item label="评定时间" {...formItemLayout}>
          {form.getFieldDecorator('professional[' + index + '].confirmTime', {
            rules: [
              {
                required: true,
                message: '请选择评定时间',
              },
            ],
          })(<DatePicker placeholder="请选择评定时间" />)}
        </Form.Item>
        {this.renderRemoveItemBtn('professional', index, ctrl.removeItem)}
      </div>
    ));
  };
  renderExpertLang = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 9 },
    };
    /* 语言能力  - languages */
    return queue.map((item, index) => (
      <div
        key={index}
        className="pos-rel mb-10 pt-24"
        style={{ border: '1px solid rgb(217, 217, 217)', borderRadius: '4px' }}
      >
        <Form.Item label="语种" {...formItemLayout}>
          {form.getFieldDecorator('languages[' + index + '].name', {
            rules: [
              {
                required: true,
                message: '请输入语种',
              },
            ],
          })(<Input placeholder="请输入语种" />)}
        </Form.Item>
        <Form.Item label="听说能力" {...formItemLayout}>
          {form.getFieldDecorator('languages[' + index + '].lsAbility', {
            rules: [
              {
                required: true,
                message: '请选择听说能力',
              },
            ],
          })(
            <Select placeholder="请选择听说能力" style={{ width: '160px' }}>
              {constant.JSON.langMasterLevel.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="读写能力" {...formItemLayout}>
          {form.getFieldDecorator('languages[' + index + '].rwAbility', {
            rules: [
              {
                required: true,
                message: '请选择读写能力',
              },
            ],
          })(
            <Select placeholder="请选择读写能力" style={{ width: '160px' }}>
              {constant.JSON.langMasterLevel.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        {this.renderRemoveItemBtn('languages', index, ctrl.removeItem)}
      </div>
    ));
  };
  renderExpertQuality = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 9 },
    };
    /* 注册执业资格 - registered */
    return queue.map((item, index) => (
      <div
        key={index}
        className="pos-rel mb-10 pt-24"
        style={{ border: '1px solid rgb(217, 217, 217)', borderRadius: '4px' }}
      >
        <Form.Item label="名称" {...formItemLayout}>
          {form.getFieldDecorator('registered[' + index + '].name', {
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
        <Form.Item label="评定时间" {...formItemLayout}>
          {form.getFieldDecorator('registered[' + index + '].confirmTime', {
            rules: [
              {
                required: true,
                message: '请选择评定时间',
              },
            ],
          })(<DatePicker placeholder="请选择评定时间" />)}
        </Form.Item>
        {this.renderRemoveItemBtn('registered', index, ctrl.removeItem)}
      </div>
    ));
  };
  renderExpertProject = (queue, ctrl) => {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    /* 科研成果 - achievement */
    return queue.map((item, index) => (
      <div
        key={index}
        className="pos-rel mb-10 pt-24"
        style={{ border: '1px solid rgb(217, 217, 217)', borderRadius: '4px' }}
      >
        <Form.Item label="名称" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].name', {
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
        <Form.Item label="时间" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].time', {
            initialValue: [],
            rules: [
              {
                required: true,
                message: '请选择时间',
              },
            ],
          })(<RangePicker />)}
        </Form.Item>
        <Form.Item label="项目级别" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].level', {
            rules: [
              {
                required: true,
                message: '请选择项目级别',
              },
            ],
          })(
            <Select placeholder="请选择项目级别" style={{ width: '160px' }}>
              {constant.JSON.projectLevel.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="参与主体性质" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].nature', {
            rules: [
              {
                required: true,
                message: '请选择主体性质',
              },
            ],
          })(
            <Select placeholder="请选择主体性质" style={{ width: '160px' }}>
              {constant.JSON.subjectNatureLevel.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="项目内容" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].content', {
            validateTrigger: ['onBlur'],
            rules: [
              {
                required: true,
                message: '请输入项目内容',
              },
            ],
          })(<Input.TextArea rows={4} placeholder="请输入项目内容" />)}
        </Form.Item>
        <Form.Item label="承担角色" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].role', {
            rules: [
              {
                required: true,
                message: '请选择承担角色',
              },
            ],
          })(
            <Select placeholder="请选择承担角色" style={{ width: '160px' }}>
              {constant.JSON.roleLevel.map(item => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="工作职责" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].duty', {
            validateTrigger: ['onBlur'],
            rules: [
              {
                required: true,
                message: '请输入工作职责',
              },
            ],
          })(<Input.TextArea rows={4} placeholder="请输入工作职责" />)}
        </Form.Item>
        <Form.Item label="工作成果" {...formItemLayout}>
          {form.getFieldDecorator('achievement[' + index + '].summary', {
            validateTrigger: ['onBlur'],
            rules: [
              {
                required: true,
                message: '请输入工作成果',
              },
            ],
          })(<Input.TextArea rows={4} placeholder="请输入工作成果" />)}
        </Form.Item>
        {this.renderRemoveItemBtn('achievement', index, ctrl.removeItem)}
      </div>
    ));
  };

  render() {
    const { multipleItemQueueLength } = this.state;
    const { preview, form } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 17 },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit} style={{ maxWidth: '1200px' }}>
        <fieldset disabled={preview}>
          <Form.Item label="姓名">
            {form.getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入姓名',
                },
              ],
            })(<Input placeholder="请输入姓名" />)}
          </Form.Item>
          <Form.Item label="头像">
            {form.getFieldDecorator('photos', {
              rules: [
                {
                  required: true,
                  message: '请上传头像',
                },
              ],
            })(<UploadImageMultiple action="/api/upload/base64" />)}
          </Form.Item>
          <Form.Item label="性别">
            {form.getFieldDecorator('sex', {
              rules: [
                {
                  required: true,
                  message: '请选择性别',
                },
              ],
            })(
              <Select placeholder="请选择性别" style={{ width: '160px' }}>
                {constant.JSON.sex.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="学历">
            {form.getFieldDecorator('education', {
              rules: [
                {
                  required: true,
                  message: '请选择学历',
                },
              ],
            })(
              <Select placeholder="请选择学历" style={{ width: '160px' }}>
                {constant.JSON.eduLevel.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="学位">
            {form.getFieldDecorator('degree', {
              rules: [
                {
                  required: true,
                  message: '请选择学位',
                },
              ],
            })(
              <Select placeholder="请选择学位" style={{ width: '160px' }}>
                {constant.JSON.degreeLevel.map(item => (
                  <Select.Option key={item.value} value={item.value}>
                    {item.label}
                  </Select.Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="邮箱">
            {form.getFieldDecorator('mailbox', {
              validateTrigger: 'onBlur',
              rules: [
                {
                  required: true,
                  message: '请输入邮箱',
                },
                {
                  type: 'email',
                  message: '请输入正确的邮箱！',
                },
              ],
            })(<Input placeholder="请输入邮箱" />)}
          </Form.Item>
          <Form.Item label="专家类型">
            {form.getFieldDecorator('experType', {
              rules: [
                {
                  required: true,
                  message: '请输入专家类型',
                },
              ],
            })(<Input placeholder="请输入专家类型" />)}
          </Form.Item>
          <Form.Item label="擅长领域">
            {form.getFieldDecorator('speciality', {
              rules: [
                {
                  required: true,
                  message: '请输入擅长领域',
                },
              ],
            })(<Input placeholder="请输入擅长领域" />)}
          </Form.Item>

          <Form.Item label="语言能力">
            <MultipleItemQueue
              disabled={!preview}
              buttonText="添加语言能力"
              queueLength={multipleItemQueueLength.languages}
            >
              {this.renderExpertLang}
            </MultipleItemQueue>
          </Form.Item>
          <Form.Item label="专业技术职称">
            <MultipleItemQueue
              disabled={!preview}
              buttonText="添加专业技术职称"
              queueLength={multipleItemQueueLength.professional}
            >
              {this.renderExpertTeah}
            </MultipleItemQueue>
          </Form.Item>
          <Form.Item label="注册执业资格">
            <MultipleItemQueue
              disabled={!preview}
              buttonText="添加执业资格"
              queueLength={multipleItemQueueLength.registered}
            >
              {this.renderExpertQuality}
            </MultipleItemQueue>
          </Form.Item>
          <Form.Item label="科研成果">
            <MultipleItemQueue
              disabled={!preview}
              buttonText="添加科研成果"
              queueLength={multipleItemQueueLength.achievement}
            >
              {this.renderExpertProject}
            </MultipleItemQueue>
          </Form.Item>
          {!preview && (
            <Form.Item className="text-center" wrapperCol={{ span: 24 }}>
              <Button type="primary" htmlType="submit">
                提交
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
