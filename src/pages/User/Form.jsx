import React from 'react';

import { Card, message } from 'antd';
import FormWidget from './FormWidget';

class UserForm extends React.Component {
  state = {
    id: this.props.location.query.id,
  };

  toList = () => {
    this.props.history.replace('/User/List');
  };

  handleFormClose = () => {
    if (this.state.id) {
      message.success('编辑成功');
    } else {
      message.success('添加成功');
    }
    this.toList();
  };

  handleFormCancel = () => {
    this.toList();
  };

  render() {
    const { id } = this.state;
    return (
      <Card>
        <div className="max-width-900px">
          <FormWidget id={id} onClose={this.handleFormClose} onCancel={this.handleFormCancel} />
        </div>
      </Card>
    );
  }
}

export default UserForm;
