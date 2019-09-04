import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Col } from 'antd';
import FormWidget from './FormWidget';
import constant from '@constant';
import LinkButton from '@components/LinkButton';
import PreviewButton from '@components/project/PreviewButton';
import YearPicker from '@components/Form/DatePicker/YearPicker';
import Area from '@components/Form/Area';
import DeleteButton from '@components/project/DeleteButton';
import SearchForm from '@components/project/SearchForm';

@connect()
@Form.create()
class BaseCrudList extends React.Component {
  searchForm = null;
  columns = [
    {
      width: 60,
      title: '年份',
      dataIndex: 'year',
    },
    {
      width: 180,
      title: '辖区名称',
      dataIndex: 'directly',
    },
    {
      width: 110,
      title: '省',
      dataIndex: 'province',
    },
    {
      width: 110,
      title: 'GDP',
      dataIndex: 'GDP',
    },
    {
      width: 110,
      title: 'GDP增速',
      dataIndex: 'addFDP',
    },
    {
      width: 110,
      title: '收入',
      dataIndex: 'income',
    },
    {
      width: 110,
      title: '增长收入',
      dataIndex: 'addIncome',
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
            <PreviewButton row={row} FormWidget={FormWidget} />
            <LinkButton type="primary" to={`Form/${row._id}`}>
              编辑
            </LinkButton>
            <span>&emsp;</span>
            <DeleteButton
              api="/basicData/delById"
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

    const formData = searchForm.getFieldsValue();
    /* 生成地区信息 */
    {
      const { area } = formData;
      delete formData.area;
      formData.province = area[0];
      formData.city = area[1];
      formData.district = area[2];
    }

    const params = {
      page,
      limit: size,
      ...formData,
    };
    dispatch({
      type: 'basicData/list',
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
              <Form.Item label="年份">
                {form.getFieldDecorator('year')(<YearPicker placeholder="请选择年份" />)}
              </Form.Item>
              <Form.Item label="地区">
                {form.getFieldDecorator('area', { initialValue: [] })(
                  <Area placeholder="请选择地区" useAddress={false} />,
                )}
              </Form.Item>
            </>
          )}
        </SearchForm>
        <div className="operator-bar">
          <LinkButton to="Form"> 添加数据 </LinkButton>
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
