import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Upload, Select } from 'antd';
import constant from '@constant';
import LinkButton from '@components/LinkButton';
import SearchForm from '@components/project/SearchForm';

@connect()
@Form.create()
class BaseCrudList extends React.Component {
  searchForm = null;
  columns = [
    {
      width: 90,
      title: '头像',
      dataIndex: 'logo',
      render(text) {
        if (!text) {
          return '暂未设置';
        }
        return <img className="max-width-100" src={text} alt="" />;
      },
    },
    {
      width: 90,
      title: 'ID',
      dataIndex: '_id',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },

    {
      title: '角色',
      dataIndex: 'role',
      render(role) {
        if (role == 'admin') {
          return <span>管理员</span>;
        }
        return <span>用户</span>;
      },
    },
    {
      title: '操作',
      render(res) {
        return <LinkButton to={`Form?id=${res._id}`}> 修改 </LinkButton>;
      },
    },
  ];

  config = {
    bordered: true,
    size: 'small',
    rowKey: '_id',
    rowSelection: {
      onChange: (keys, rows) => {
        this.setState({
          selection: rows,
        });
      },
    },
  };

  defaultPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  pagination = JSON.parse(JSON.stringify(this.defaultPagination));

  state = {
    dataSource: [],
    selection: [],
  };

  /* 处理dataSource中的数据项 */
  rowPipe = row => {
    row.cnType = constant.policy.typeMap[row.type] || row.status;
    row.cnStatus = constant.public.status.audit[row.status] || row.status;
    return row;
  };

  loadDataSource = (page, size) => {
    const { pagination, searchForm } = this;
    const { dispatch } = this.props;
    page = page || pagination.current;
    size = size || pagination.pageSize;
    const params = {
      page,
      limit: size,
      ...searchForm.getFieldsValue(),
    };
    dispatch({
      type: 'user/list',
      payload: params,
    }).then(res => {
      if (res.status !== 200) return;
      res = res.data;
      const dataSource = res.docs.map(this.rowPipe);
      pagination.current = page;
      pagination.pageSize = size;
      pagination.total = res.total;
      this.setState({
        dataSource,
      });
    });
  };

  handleSearchFormChange = () => {
    const { defaultPagination } = this;
    this.loadDataSource(defaultPagination.current, defaultPagination.pageSize);
  };

  componentDidMount() {
    this.loadDataSource();
  }

  renderBatchOperatorBar = () => {
    return null;
  };

  render() {
    const { columns, config, pagination } = this;
    const { dataSource, selection } = this.state;

    return (
      <Card className="page__list">
        <SearchForm
          wrappedComponentRef={ref => (this.searchForm = ref)}
          onChange={this.handleSearchFormChange}
        >
          {form => (
            <>
              <Form.Item label="用户名">
                {form.getFieldDecorator('keyWords')(<Input placeholder="请输入标题" />)}
              </Form.Item>
            </>
          )}
        </SearchForm>
        <div className="operator-bar">
          <LinkButton to="Form"> 添加用户 </LinkButton>
          {selection.length > 0 && this.renderBatchOperatorBar()}
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          {...config}
          pagination={pagination}
          onChange={pagination => this.loadDataSource(pagination.current, pagination.pageSize)}
        />
      </Card>
    );
  }
}

export default BaseCrudList;
