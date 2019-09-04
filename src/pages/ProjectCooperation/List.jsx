import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import './List.scss';
import { Card, Table, Button, Form, Input, message, Modal, Tooltip, Select } from 'antd';
import ProTable from '@components/Table/index';
import constant from '@constant';
import FormWidget from './FormWidget';
import AuditButton from '@components/project/AuditButton';
import StickButton from '@components/project/StickButton';
import LinkButton from '@components/LinkButton';
import PreviewButton from '@components/project/PreviewButton';
import DeleteButton from '@components/project/DeleteButton';
import SearchForm from '@components/project/SearchForm';

/**
 * 重置、分页
 * */

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

const RenderBatchOperatorBar = props => {
  return null;
};

@connect()
class List extends React.Component {
  // table的假数据
  columns = [
    {
      width: 180,
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '公司名称',
      dataIndex: 'company',
    },
    {
      title: '推广公司',
      dataIndex: 'Tcompany',
    },
    {
      title: '推广联系方式',
      dataIndex: 'Tcontact',
    },
    {
      title: '推广二维码',
      // dataIndex: 'Tphotos',
      key: 'Tphotos',
      render: (text, row, index) => {
        return <img src={row.Tphotos} width="90px" height="90px" />;
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
              api="/collaborate/updateStatusById"
              status={row.status}
              finallyCallback={this.loadDataSource}
            />
            <StickButton
              row={row}
              api="/collaborate/stickById"
              status={row.stick}
              finallyCallback={this.loadDataSource}
            />
            <PreviewButton row={row} FormWidget={FormWidget} />
            <DeleteButton
              api="/collaborate/delById"
              row={row}
              finallyCallback={this.loadDataSource}
            />
          </>
        );
      },
    },
  ];
  defaultPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  pagination = JSON.parse(JSON.stringify(this.defaultPagination));
  searchForm = null;
  state = {
    selectRows: [],
    dataSource: [],
    params: {
      page: 1,
      limit: 10,
      keyWords: '',
    },
  };

  componentDidMount() {
    this.loadDataSource(this.state.params);
  }

  handleSearchFormChange = () => {
    const { defaultPagination } = this;
    this.queryList(defaultPagination.current, defaultPagination.pageSize);
  };

  render() {
    const { dataSource, selectRows } = this.state;
    const { columns, pagination } = this;
    return (
      <Card className="page__list">
        <SearchForm
          wrappedComponentRef={ref => (this.searchForm = ref)}
          onChange={this.handleSearchFormChange}
        >
          {form => (
            <>
              <Form.Item label="项目名称">
                {form.getFieldDecorator('keyWords')(<Input placeholder="请输入项目名称" />)}
              </Form.Item>
            </>
          )}
        </SearchForm>
        <LinkButton type="primary" to="Form">
          新增项目
        </LinkButton>
        {selectRows.length > 0 && (
          <RenderBatchOperatorBar handleDelItemBatch={this.handleDelItemBatch} />
        )}
        <br />
        <br />
        <ProTable
          columns={columns}
          data={dataSource}
          onChange={pagination => this.queryList(pagination.current, pagination.pageSize)}
          onSelectChange={this.saveSelectRows}
          pagination={pagination}
        />
      </Card>
    );
  }

  // 获取请求的参数
  getParams = (page, size) => {
    const { pagination, searchForm } = this;
    page = page || pagination.current;
    size = size || pagination.pageSize;
    const params = {
      page,
      limit: size,
      ...searchForm.getFieldsValue(),
    };
    return params;
  };
  // 加载列表
  loadDataSource = (
    params = {
      page: 1,
      limit: 10,
      keyWords: '',
    },
  ) => {
    const { dispatch } = this.props;
    const { pagination } = this;
    dispatch({
      type: 'ProjectCooperation/list',
      payload: params,
    }).then(res => {
      if (res.status !== 200) {
        message.error('系统异常，请联系管理员！');
        return;
      }
      const data = res.data;
      const dataSource = data.docs.map(this.rowPipe);
      pagination.current = data.page;
      pagination.pageSize = data.limit;
      pagination.total = data.total;
      this.setState({
        dataSource,
      });
    });
  };
  // 获取被勾选的row
  saveSelectRows = (key, rows) => {
    this.setState({
      selectRows: rows,
    });
  };
  // 搜索
  queryList = (page, size) => {
    this.setState(
      {
        params: this.getParams(page, size),
      },
      () => {
        this.loadDataSource(this.state.params);
      },
    );
  };
  /* 处理dataSource中的数据项 */
  rowPipe = row => {
    if (row.avatar) {
      row.avatar = row.avatar.split(',')[0];
    }
    row.cnStatus = constant.public.status.audit[row.status] || row.status;
    return row;
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
          type: 'ProjectCooperation/del',
          payload: {
            id: rows._id,
          },
        }).then(res => {
          if (res.status !== 200) {
            message.error(res.message);
            return;
          }
          message.success(res.message);
          this.loadDataSource(this.state.params);
        });
      },
    });
  };

  handleDelItemBatch = () => {
    this.handleDelItem(this.state.selectRows);
  };
}

export default List;
