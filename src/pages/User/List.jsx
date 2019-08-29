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

  onSubmit = e => {
    this.props.onSubmit(e, this.props.form);
  };
  onReset = e => {
    this.props.onReset(e, this.props.form);
  };

  render() {
    const { form } = this.props;
    return (
      <div className="search-bar">
        <Form layout="inline" onSubmit={this.onSubmit}>
          <Form.Item label="用户名查询">
            {form.getFieldDecorator('phone')(<Input placeholder="请输入用户名" />)}
          </Form.Item>
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

@connect()
@Form.create()
class UserList extends React.Component {
  searchForm = null;
  columns = [
    {
      width: 40,
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
    },
    {
      width: 100,
      title: '头像',
      dataIndex: 'avatar',
      render: (text, row, index) => {
        if (!text) {
          return '暂未设置';
        }
        return <img src={row.avatar} width="100%" />;
      },
    },
    {
      title: '用户名',
      dataIndex: 'phone',
    },
    // {
    //   width: 100,
    //   title: '创建时间',
    //   dataIndex: 'id',
    // },
    {
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        return (
          <>
            <Button type="primary" onClick={() => this.openItemEditModal(row)}>
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
    size: 'small',
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
    if (!row.avatar) return row;
    row.avatar = row.avatar.split(',')[0];
    return row;
  }

  loadDataSource = (page, size) => {
    const { pagination, searchForm } = this;
    const { dispatch } = this.props;
    page = page || pagination.current;
    size = size || pagination.pageSize;
    const params = {
      page,
      size,
      ...searchForm.getFieldsValue(),
    };
    dispatch({
      type: 'user/list',
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
    this.state.editModal.row = row;
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
          type: 'user/del',
          payload: rows.map(item => item.id),
        }).then(res => {
          if (res.code !== 200) {
            message.error(res.message);
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
      const { defaultPagination } = this;
      this.loadDataSource(defaultPagination.current, defaultPagination.pageSize);
    });
  };

  handleSearchReset = (e, form) => {
    form.resetFields();
    this.handleSearch(e, form);
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
        <SearchForm
          ref={ref => (this.searchForm = ref)}
          onSubmit={this.handleSearch}
          onReset={this.handleSearchReset}
        />
        <div className="operator-bar">
          <LinkButton to="Form">添加用户</LinkButton>
          {selection.length > 0 && this.renderBatchOperatorBar()}
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          {...config}
          pagination={pagination}
          onChange={pagination => this.loadDataSource(pagination.current, pagination.pageSize)}
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

export default UserList;
