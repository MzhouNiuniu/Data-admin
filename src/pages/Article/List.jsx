import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal } from 'antd';
import FormWidget from './FormWidget';
import LinkButton from '@components/LinkButton';

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
            {form.getFieldDecorator('title')(<Input placeholder="请输入文章标题" />)}
          </Form.Item>
          <Form.Item label="内容查询">
            {form.getFieldDecorator('content')(<Input placeholder="请输入文章内容" />)}
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
class ArticleList extends React.Component {
  columns = [
    {
      width: 40,
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
    },
    {
      width: 100,
      title: '封面',
      dataIndex: 'picUrl',
      render: (text, row, index) => {
        if (!row.picUrl) {
          return <p>暂无封面</p>;
        }
        return <img src={row.picUrl} width="100%" />;
      },
    },
    {
      width: 200,
      title: '标题',
      dataIndex: 'title',
      sorter: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        return (
          <>
            <LinkButton type="primary" to={`Form/${row._id}`}>
              编辑
            </LinkButton>
            <span>&emsp;</span>
            <Button type="primary" onClick={() => this.openItemEditModal(row)}>
              此页编辑
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
    rowKey: 'id',
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
    editModal: {
      visible: false,
      row: null,
    },
  };

  /* 处理dataSource中的数据项 */
  rowPipe(row) {
    if (!row.picUrl) return row;
    row.picUrl = row.picUrl.split(',')[0];
    return row;
  }

  loadDataSource = (page, size) => {
    const { pagination } = this;
    const { dispatch } = this.props;
    page = page || pagination.current;
    size = size || pagination.pageSize;
    const params = {
      page,
      size,
      ...this.queryParams,
    };
    dispatch({
      type: 'article/list',
      payload: params,
    }).then(res => {
      if (res.code !== 200) return;
      const dataSource = res.data.map(this.rowPipe);
      pagination.current = page;
      pagination.pageSize = size;
      pagination.total = res.total;
      this.setState({
        dataSource,
      });
    });
  };

  openItemEditModal = row => {
    this.state.editModal.visible = true;
    this.state.editModal.index = row;
    this.setState({});
  };

  closeEditModal = () => {
    this.state.editModal.visible = false;
    this.setState({});
  };

  handleEditModalClose = () => {
    message.success('编辑成功');
    this.closeEditModal();
    this.loadDataSource();
  };

  handleEditModalCancel = () => {
    this.closeEditModal();
  };

  handleDelItem = rows => {
    Modal.confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'article/del',
          payload: rows.map(item => item.id),
        }).then(res => {
          if (res.code !== 200) {
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
    const { dataSource, selection, editModal } = this.state;
    return (
      <Card className="page__list">
        <SearchForm onSubmit={this.handleSearch} onReset={this.handleSearchReset} />
        <div className="operator-bar">
          <LinkButton to="Form"> 添加文章 </LinkButton>
          {selection.length > 0 && this.renderBatchOperatorBar()}
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          {...config}
          pagination={pagination}
          onChange={this.handleTableChange}
        />
        <Modal
          className="page__list__edit-modal"
          visible={editModal.visible}
          footer={null}
          width="70%"
          onCancel={this.handleEditModalCancel}
        >
          {editModal.visible && editModal.row && (
            <FormWidget
              id={editModal.row.id}
              onClose={this.handleEditModalClose}
              onCancel={this.handleEditModalCancel}
            />
          )}
        </Modal>
      </Card>
    );
  }
}

export default ArticleList;
