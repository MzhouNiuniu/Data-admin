import React from 'react';
import propTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Modal, Icon } from 'antd';
import MultipleItemQueue from '@components/Form/MultipleItemQueue';
import UploadFile from '@components/Form/Upload/File';

/**
 * form不能再继续嵌套了，例如：form.getFieldDecorator('financing[' + index + '].enterpriseBond.record')
 * */
@Form.create({ name: 'bondRecord' })
class BondRecordForm extends React.Component {
  static propTypes = {
    records: propTypes.array.isRequired,
    onCancel: propTypes.func,
    onSubmit: propTypes.func,
  };

  state = {
    queueLength: 0,
  };

  componentDidMount() {
    const { records } = this.props;
    if (Array.isArray(records) && records.length) {
      this.setState(
        {
          queueLength: records.length,
        },
        () => {
          Promise.resolve().then(() => {
            this.props.form.setFieldsValue({
              records: records,
            });
          });
        },
      );
    } else {
      // 现在是从列表点击弹出，默认展示一个
      this.setState({
        queueLength: 1,
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSubmit && this.props.onSubmit(this.props.form);
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

  render() {
    const { queueLength } = this.state;
    const { form } = this.props;

    /* 记录 - records */
    return (
      <Form onSubmit={this.handleSubmit}>
        <MultipleItemQueue buttonText="添加记录" queueLength={queueLength} maxHeight="660px">
          {(queue, ctrl) => {
            return queue.map((item, index) => (
              <div
                key={index}
                className="pos-rel mb-10 pt-24"
                style={{
                  border: '1px solid rgb(217, 217, 217)',
                  borderRadius: '4px',
                  padding: '0 10px',
                }}
              >
                <Row gutter={30}>
                  <Col span={6}>
                    <Form.Item label="债券名称">
                      {form.getFieldDecorator('records[' + index + '].abbreviation', {
                        rules: [
                          {
                            required: true,
                            message: '请输入债券名称',
                          },
                        ],
                      })(<Input placeholder="请输入债券名称" />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="成交时间">
                      {form.getFieldDecorator('records[' + index + '].makeTime', {
                        rules: [
                          {
                            required: true,
                            message: '请选择成交时间',
                          },
                        ],
                      })(<Input placeholder="请选择成交时间" />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="成交金额">
                      {form.getFieldDecorator('records[' + index + '].makeMoney', {
                        rules: [
                          {
                            required: true,
                            message: '请输入成交金额',
                          },
                        ],
                      })(<Input placeholder="请输入成交金额" />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="剩余时间">
                      {form.getFieldDecorator('records[' + index + '].remainingTime', {
                        rules: [
                          {
                            required: true,
                            message: '请输入剩余时间',
                          },
                        ],
                      })(<Input placeholder="请输入剩余时间" />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="成交利率">
                      {form.getFieldDecorator('records[' + index + '].makeRate', {
                        rules: [
                          {
                            required: true,
                            message: '请输入成交利率',
                          },
                        ],
                      })(<Input placeholder="请输入成交利率" />)}
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="偏离（BP）">
                      {form.getFieldDecorator('records[' + index + '].BP', {
                        rules: [
                          {
                            required: true,
                            message: '请输入偏离（BP）',
                          },
                        ],
                      })(<Input placeholder="请输入偏离（BP）" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="相关文件">
                  {form.getFieldDecorator('records[' + index + '].aboutFile')(
                    <UploadFile multiple={false} />,
                  )}
                </Form.Item>
                <Form.Item label="其它文件">
                  {form.getFieldDecorator('records[' + index + '].other')(
                    <UploadFile multiple={false} />,
                  )}
                </Form.Item>
                <Icon
                  type="close-circle"
                  className="pos-abs right-0 top-0 pt-6 pr-6 cursor-pointer"
                  style={{ fontSize: '20px' }}
                  onClick={() => this.removeMultipleItem('records', index, ctrl.removeItem)}
                />
              </div>
            ));
          }}
        </MultipleItemQueue>
        <div className="text-right mt-10">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <span>&emsp;</span>
          <Button onClick={this.props.onCancel}>取消</Button>
        </div>
      </Form>
    );
  }
}

class BondRecordManage extends React.Component {
  static propTypes = {
    records: propTypes.array, // isRequired
    setRecords: propTypes.func.isRequired, // 数据流：内(setRecords)->外(更新)->内(获取)
  };

  static defaultProps = {
    records: [],
  };

  state = {
    visible: false,
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
        return;
      }

      this.props.setRecords(formData.records);
      this.handleCloseModal();
    });
  };

  render() {
    const { visible } = this.state;
    const { records } = this.props;

    return (
      <>
        <Button type="primary" onClick={this.handleOpenModal}>
          记录管理
        </Button>
        <Modal
          closable={false}
          destroyOnClose
          visible={visible}
          footer={null}
          width="950px"
          onCancel={this.handleCloseModal}
        >
          <BondRecordForm
            records={records}
            onSubmit={this.handleSubmit}
            onCancel={this.handleCloseModal}
          />
        </Modal>
      </>
    );
  }
}

export default BondRecordManage;
