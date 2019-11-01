import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Upload, Select } from 'antd';
import constant from '@constant';
import LinkButton from '@components/LinkButton';
import PreviewButton from '@components/project/PreviewButton';
import AuditButton from '@components/project/AuditButton';
import DeleteButton from '@components/project/DeleteButton';
import SearchForm from '@components/project/SearchForm';
import BondRecordManage from './BondRecordManage';
import FormWidget from './FormWidget';

@connect()
@Form.create()
class BaseCrudList extends React.Component {
  searchForm = null;
  columns = [
    {
      width: 50,
      title: '年份',
      dataIndex: 'year',
    },
    {
      width: 220,
      title: '公司名称',
      dataIndex: 'DataName',
    },
    {
      width: 120,
      title: '融资种类',
      dataIndex: 'financingType',
    },
    {
      width: 120,
      title: '债券代码',
      dataIndex: 'code',
    },
    {
      width: 120,
      title: '债券简称',
      dataIndex: 'abbreviation',
    },
    {
      width: 120,
      title: '债券类型',
      dataIndex: 'type',
    },
    {
      width: 120,
      title: '债券全称',
      dataIndex: 'fullName',
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
            <BondRecordManage
              records={row.record}
              setRecords={records => this.setRecords(row, records)}
            />
            <span>&emsp;</span>
            <AuditButton
              row={row}
              api="/financialing/updateStatusById"
              status={row.status}
              finallyCallback={this.loadDataSource}
            />
            <PreviewButton row={row} FormWidget={FormWidget} onClose={this.loadDataSource} />
            <DeleteButton
              api="/financialing/delById"
              row={row}
              finallyCallback={this.loadDataSource}
            />
          </>
        );
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
      type: 'financial/list',
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

  setRecords = (row, records) => {
    const oldRecords = row.record;
    row.record = records;

    this.props
      .dispatch({
        type: 'financial/update',
        payload: {
          id: row._id,
          record: row.record,
        },
      })
      .then(res => {
        if (res.status !== 200) {
          row.record = oldRecords;
          message.error(res.message);
          return;
        }
      })
      .finally(() => {
        this.setState({});
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
              <Form.Item label="公司名称">
                {form.getFieldDecorator('keyWords')(<Input placeholder="请输入标题" />)}
              </Form.Item>
            </>
          )}
        </SearchForm>
        <div className="operator-bar">
          <LinkButton to="FinancialForm"> 添加融资信息 </LinkButton>
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
