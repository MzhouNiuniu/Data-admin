import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Upload } from 'antd';
import FormWidget from './FormWidget';

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
  dict = {
    status: {
      '0': '未审核',
      '1': '通过',
      '2': '未通过',
    },
  };

  columns = [
    {
      width: 260,
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
    },
    {
      title: '创建人',
      dataIndex: 'author.userName',
    },
    {
      title: '创建时间',
      dataIndex: 'releaseTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        const status = row._status;
        return (
          <>
            {status === '0' && (
              <>
                <Button className="success" onClick={() => this.handleAuditItem(row, 1)}>
                  审核通过
                </Button>
                <span>&emsp;</span>
                <Button className="warning" onClick={() => this.handleAuditItem(row, 2)}>
                  审核不通过
                </Button>
                <span>&emsp;</span>
              </>
            )}
            <Button type="primary" onClick={() => this.handleEditItem(row)}>
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

    row._status = row.status;
    row.status = this.dict.status[row.status] || row.status;
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
      type: 'news/list',
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

  handleEditItem = row => {
    this.props.history.push('Form/' + row._id);
  };

  /**
   * @param {number} status - 状态，1通过 2未通过
   * */
  handleAuditItem = (row, status) => {
    Modal.confirm({
      title: status === 1 ? '通过？' : '不通过',
      content: row.title,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'news/audit',
          payload: {
            id: row._id,
            status,
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
          type: 'news/del',
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
            添加新闻
          </Button>
          <span>&emsp;</span>
          <Upload
            showUploadList={false}
            name="file"
            action="/a/news/importExcel"
            onChange={this.handleUploadTplFile}
          >
            <Button type="primary">导入新闻</Button>
          </Upload>
          ,{selection.length > 0 && this.renderBatchOperatorBar()}
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
