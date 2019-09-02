import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Upload, Select } from 'antd';
import constant from '@constant';
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
          <Form.Item label="标题查询">
            {form.getFieldDecorator('keyWords')(<Input placeholder="请输入标题" />)}
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
    // {
    //   title: '操作',
    //   key: 'action',
    //   render: (text, row, index) => {
    //     return (
    //       <>
    //         <Button type="danger" onClick={() => this.handleDelItem([row])}>
    //           删除
    //         </Button>
    //       </>
    //     );
    //   },
    // },
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
          type: 'user/del',
          payload: {
            id: rows._id,
          },
        }).then(res => {
          if (res.status !== 200) {
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
    const { dataSource, selection } = this.state;

    return (
      <Card className="page__list">
        <SearchForm
          ref={ref => (this.searchForm = ref)}
          onSubmit={this.handleSearch}
          onReset={this.handleSearchReset}
        />
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
