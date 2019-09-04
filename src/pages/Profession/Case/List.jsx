import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Upload, Tooltip } from 'antd';
import constant from '@constant';
import AuditButton from '@components/project/AuditButton';
import StickButton from '@components/project/StickButton';
import LinkButton from '@components/LinkButton';
import PreviewButton from '@components/project/PreviewButton';
import FormWidget from './FormWidget';
import DeleteButton from '@components/project/DeleteButton';
import SearchForm from '@components/project/SearchForm';

@connect()
@Form.create()
class BaseCrudList extends React.Component {
  searchForm = null;
  columns = [
    {
      width: 90,
      title: '封面',
      dataIndex: 'cover',
      render(text) {
        if (!text) {
          return '暂未设置';
        }
        return <img className="max-width-100" src={text} alt="" />;
      },
    },
    {
      width: 220,
      title: '标题',
      dataIndex: 'name',
    },
    {
      width: 240,
      title: '简介',
      dataIndex: 'brief',
      render(text) {
        return (
          <Tooltip title={text}>
            <span className="one-line-text" style={{ width: '300px' }}>
              {text}
            </span>
          </Tooltip>
        );
      },
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
              api="/researchScriptures/updateStatusById"
              status={row.status}
              finallyCallback={this.loadDataSource}
            />
            <StickButton
              row={row}
              api="/researchScriptures/stickById"
              status={row.stick}
              finallyCallback={this.loadDataSource}
            />
            <PreviewButton row={row} FormWidget={FormWidget} />
            <DeleteButton
              api="/researchScriptures/delById"
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
              <Form.Item label="标题">
                {form.getFieldDecorator('keyWords')(<Input placeholder="请输入标题" />)}
              </Form.Item>
            </>
          )}
        </SearchForm>
        <div className="operator-bar">
          <LinkButton to="Form"> 添加案例 </LinkButton>
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
