import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Drawer, Popconfirm } from 'antd';
import FormWidget from './FormWidget';
import constant from '@constant';
import AuditButton from '@components/project/AuditButton';
import StickButton from '@components/project/StickButton';
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
      dataIndex: 'photos',
      render(text) {
        if (!text) {
          return <p>暂未设置</p>;
        }
        return <img className="max-width-100" src={text} alt="" />;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '性别',
      dataIndex: 'sex',
    },
    {
      title: '个人简介',
      dataIndex: 'current',
    },
    {
      title: '研究方向',
      dataIndex: 'direction',
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
            <StickButton
              row={row}
              api="/a/expert/stickById"
              status={row.stick}
              finallyCallback={this.loadDataSource}
            />
            <Button onClick={() => this.handlePreviewItem(row)}>查看</Button>
            <span>&emsp;</span>
            <LinkButton type="primary" to={`Form/${row._id}`}>
              编辑
            </LinkButton>
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

  state = {
    dataSource: [],
    selection: [],
    formWidgetModal: {
      visible: false,
      row: null,
    },
  };

  /* 处理dataSource中的数据项 */
  rowPipe = row => {
    if (row.avatar) {
      row.avatar = row.avatar.split(',')[0];
    }
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
      type: 'expert/list',
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

  handlePreviewItem = row => {
    this.setState({
      formWidgetModal: {
        visible: true,
        row,
      },
    });
  };
  handleClosePreviewModal = () => {
    this.setState({
      formWidgetModal: {
        visible: false,
        row: null,
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
          type: 'expert/del',
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
    const { dataSource, selection, formWidgetModal } = this.state;

    return (
      <Card className="page__list">
        <SearchForm
          ref={ref => (this.searchForm = ref)}
          onSubmit={this.handleSearch}
          onReset={this.handleSearchReset}
        />
        <div className="operator-bar">
          <LinkButton to="Form"> 添加专家 </LinkButton>
          {selection.length > 0 && this.renderBatchOperatorBar()}
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          {...config}
          pagination={pagination}
          onChange={pagination => this.loadDataSource(pagination.current, pagination.pageSize)}
        />
        <Drawer
          placement="right"
          title="查看详情"
          width={900}
          destroyOnClose
          visible={formWidgetModal.visible}
          onClose={this.handleClosePreviewModal}
        >
          {formWidgetModal.visible && <FormWidget preview id={formWidgetModal.row._id} />}
        </Drawer>
      </Card>
    );
  }
}

export default BaseCrudList;
