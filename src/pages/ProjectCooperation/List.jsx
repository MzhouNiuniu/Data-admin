import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import './List.scss';
import { Card, Table, Button, Form, Input, message, Modal, Drawer, Tooltip, Select  } from 'antd';
import ProTable from '@components/Table/index'
import constant from '@constant';

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`Selected: ${value}`);
}

@Form.create({
    name: 'search',
  })
class SearchForm extends React.Component {
  static propTypes = {
    onSubmit: propTypes.func,
    onReset: propTypes.func,
  };
  static defaultProps = {
    onSubmit() {},
    onReset() {},
  };
  state = {
    onSubmit: e => {
      e.preventDefault();
      this.props.onSubmit(e, this.props.form);
    },
    onReset: e => {
      e.preventDefault();
      this.props.onReset(e, this.props.form);
    },
    
  };
  render() {
    const { onSubmit, onReset } = this.state;
    const { form } = this.props;
    const size = 'default';
    return (
      <div className="search-bar">
        <Form layout="inline" onSubmit={onSubmit}>
          <Form.Item label="标题查询">
            {form.getFieldDecorator('keyWords')(<Input placeholder="请输入标题" />)}
          </Form.Item>
          <Form.Item label="类型选择">
              {
                  form.getFieldDecorator('type', {
                      initialValue: 'd13'
                  })(<Select size={size} onChange={handleChange} style={{ width: 200 }}>{children}</Select>)
              }
              
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <span>&emsp;</span>
            <Button onClick={onReset}>重置</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}


@connect()
class List extends React.Component {
  // table的假数据
  columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: '操作',
      key: 'action',
      render: () => {
        return (
          <> 
            <Button onClick={() => this.handlePreviewItem(row)}>查看</Button>
            <span>&emsp;</span>
            <Button type="primary" onClick={() => this.handleEditItem(row)}>
              编辑
            </Button>
            <span>&emsp;</span>
            <Button type="danger" onClick={() => this.handleDelItem([row])}>
              删除
            </Button>
          </>
        );
      }
    }
  ];
  tableData = []
  state={
    selectRows: []
  }
  saveSelectRows = (key, rows) => {
    this.setState({
      selectRows: rows
    })
  }
  constructor(props) {
    super(props);
    for (let i = 0; i < 46; i++) {
      this.tableData.push({
        key: `Edward King ${i}`,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
      });
    }
  }
  render() {
    return (
      <Card className="page__list">
        <SearchForm/>
        <Button type="primary" onClick={() => this.handlePreviewItem(row)}>新增项目</Button>
        <br/>
        <br/>
        <ProTable 
        columns={this.columns} 
        data={this.tableData} 
        onSelectChange={this.saveSelectRows}
        pagination={{}}
        />
      </Card>
    )
  }
}

export default List;