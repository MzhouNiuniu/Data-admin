import React from 'react';
import propTypes from 'prop-types';
import { Button, Form } from 'antd';

@Form.create({ name: 'search' })
class SearchForm extends React.Component {
  static propTypes = {
    children: propTypes.func, // children(form)
    onChange: propTypes.func,
  };

  formData = {};

  updateFormData = () => {
    this.formData = this.props.form.getFieldsValue();
  };

  componentDidMount() {
    this.updateFormData();
  }

  getFieldsValue = () => {
    // 临时深拷贝
    return JSON.parse(JSON.stringify(this.formData));
  };

  onSubmit = e => {
    e.preventDefault();
    this.onChange();
  };

  onReset = () => {
    this.props.form.resetFields();
    this.onChange();
  };

  onChange = () => {
    this.updateFormData();
    this.props.onChange && this.props.onChange();
  };

  render() {
    const { children, form } = this.props;
    if (!children) {
      return null;
    }
    return (
      <div className="search-bar">
        <Form layout="inline" onSubmit={this.onSubmit}>
          {children(form)}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <span>&emsp;</span>
            <Button onClick={this.onReset}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default SearchForm;
