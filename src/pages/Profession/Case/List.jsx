import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Upload } from 'antd';
import constant from '@constant';
import AuditButton from '@components/project/AuditButton';

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
      this.props.onSubmit(e, this.props.form);
    },
    onReset: e => {
      this.props.onReset(e, this.props.form);
    },
  };

  render() {
    const { onSubmit, onReset } = this.state;
    const { form } = this.props;
    return (
      <div className="search-bar">
        <Form layout="inline" onSubmit={onSubmit}>
          <Form.Item label="标题查询">
            {form.getFieldDecorator('keyWords')(<Input placeholder="请输入标题" />)}
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
@Form.create()
class BaseCrudList extends React.Component {
  columns = [
    {
      width: 260,
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '类型',
      dataIndex: '_id',
    },
    {
      title: '审核状态',
      dataIndex: 'cnStatus',
    },
    {
      title: '创建时间',
      dataIndex: 'releaseTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        return (
          <>
            <AuditButton
              row={row}
              api="/a/expert/updateStatusById"
              status={row.status}
              finallyCallback={this.loadDataSource}
            />
            <Button type="primary" href={`Form/${row._id}`}>
              编辑
            </Button>
            <span>&emsp;</span>
            <Button type="danger" onClick={() => this.handleDelItem([row])}>
              删除
            </Button>
          </>
        );
      },
    },
  ];

  config = {
    bordered: true,
    size: 'middle',
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

  queryParams = {
    /* 见 SearchForm */
  };
  state = {
    dataSource: [],
    selection: [],
  };

  /* 处理dataSource中的数据项 */
  rowPipe = row => {
    if (row.avatar) {
      row.avatar = row.avatar.split(',')[0];
    }

    row.cnStatus = row.status;
    row.status = constant.public.status.audit[row.status] || row.status;
    return row;
  };

  loadDataSource = (page, size) => {
    const { pagination, queryParams } = this;
    const { dispatch } = this.props;
    page = page || pagination.current;
    size = size || pagination.pageSize;
    const params = {
      page,
      limit: size,
      ...queryParams,
    };
    dispatch({
      type: 'professionCase/list',
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

  handleAddItem = () => {
    this.props.history.push('Form');
  };

  handleDelItem = rows => {
    rows = rows[0]; // 暂时没有批量
    Modal.confirm({
      title: '确定要删除这些数据吗？',
      content: rows.title,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'professionCase/del',
          payload: {
            id: rows._id,
          },
        }).then(res => {
          if (res.status !== 200) {
            message.warn(res.message);
            return;
          }
          message.success(res.message);
          this.loadDataSource();
        });
      },
    });
  };

  handleDelItemBatch = () => {
    this.handleDelItem(this.state.selection);
  };

  handleSearch = (e, form) => {
    e.preventDefault();
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      Object.assign(this.queryParams, formData);
      const { defaultPagination } = this;
      this.loadDataSource(defaultPagination.current, defaultPagination.pageSize);
    });
  };

  handleSearchReset = (e, form) => {
    form.resetFields();
    this.handleSearch(e, form);
  };

  handleTableChange = (pagination, filters, sorter) => {
    const otherParams = {};
    if (sorter.field) {
      otherParams['sort___' + sorter.field] = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    Object.assign(this.queryParams, otherParams);
    this.loadDataSource(pagination.current, pagination.pageSize);
  };

  handleUploadTplFile = info => {
    if (info.file.status !== 'done') return;
    const { defaultPagination } = this;
    this.loadDataSource(defaultPagination.current, defaultPagination.pageSize);
  };

  componentDidMount() {
    this.loadDataSource();
  }

  renderBatchOperatorBar = () => {
    return (
      <>
        <span>&emsp;</span>
        <Button type="danger" onClick={this.handleDelItemBatch}>
          批量删除
        </Button>
      </>
    );
  };

  render() {
    const { columns, config, pagination } = this;
    const { dataSource, selection } = this.state;

    return (
      <Card className="page__list">
        <SearchForm onSubmit={this.handleSearch} onReset={this.handleSearchReset} />
        <div className="operator-bar">
          <Button type="primary" onClick={this.handleAddItem}>
            添加案例
          </Button>
          <span>&emsp;</span>
          <Upload
            showUploadList={false}
            name="file"
            action="/a/professionCase/importExcel"
            onChange={this.handleUploadTplFile}
          >
            <Button type="primary">导入案例</Button>
          </Upload>
          {selection.length > 0 && this.renderBatchOperatorBar()}
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          {...config}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
      </Card>
    );
  }
}

export default BaseCrudList;
