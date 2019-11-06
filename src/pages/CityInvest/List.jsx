import './List.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { Card, Table, Button, Form, Input, message, Modal, Upload, Select } from 'antd';
import constant from '@constant';
import FormWidget from './FormWidget';
import InfoManageForm from './InfoManageForm';
import AuditButton from '@components/project/AuditButton';
import LinkButton from '@components/LinkButton';
import PreviewButton from '@components/project/PreviewButton';
import DeleteButton from '@components/project/DeleteButton';
import SearchForm from '@components/project/SearchForm';

@connect()
@Form.create()
class BaseCrudList extends React.Component {
  // $refs
  searchForm = null;
  infoManageForm = null;

  columns = [
    {
      width: 220,
      title: '标题',
      dataIndex: 'name',
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
            {// 1 = 公司审核通过
            row.companyStatus === 1 && (
              <>
                <Button type="primary" onClick={() => this.handleOpenInfoManageModal(row)}>
                  信息管理
                </Button>
                <span>&emsp;</span>
              </>
            )}
            <AuditButton
              row={row}
              api="/companyData/updateStatusById"
              status={row.status}
              finallyCallback={this.loadDataSource}
            />
            <PreviewButton
              row={row}
              FormWidget={FormWidget}
              onClose={newRow => this.loadDataSource()}
            />
            <DeleteButton
              api="/companyData/delById"
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
    infoManageModal: {
      visible: false,
      id: '',
    },
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
      type: 'cityInvest/list',
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

  componentDidMount() {
    this.loadDataSource();
  }

  // 搜索表单
  handleSearchFormChange = () => {
    const { defaultPagination } = this;
    this.loadDataSource(defaultPagination.current, defaultPagination.pageSize);
  };

  // 模态框 - 信息管理
  handleOpenInfoManageModal = row => {
    this.setState({
      infoManageModal: {
        visible: true,
        id: row._id,
      },
    });
  };
  handleCloseInfoManageModal = () => {
    this.setState({
      infoManageModal: {
        visible: false,
      },
    });
  };
  handleInfoManageFormSubmit = () => {
    this.infoManageForm
      .validateFields()
      .then(formData => {
        this.props
          .dispatch({
            type: 'cityInvest/update',
            payload: {
              id: this.state.infoManageModal.id,
              ...formData,
            },
          })
          .then(res => {
            if (res.status !== 200) {
              message.error(res.message);
              return;
            }

            message.success('修改成功');
            this.handleCloseInfoManageModal();
          });
      })
      .catch(() => {});
  };

  renderBatchOperatorBar = () => {
    return null;
  };

  render() {
    const { columns, config, pagination } = this;
    const { dataSource, selection, infoManageModal } = this.state;
    return (
      <>
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
            <LinkButton to="Form"> 添加公司 </LinkButton>
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
        <Modal
          width="1000px"
          destroyOnClose
          footer={null}
          visible={infoManageModal.visible}
          onCancel={this.handleCloseInfoManageModal}
        >
          <InfoManageForm
            wrappedComponentRef={ref => (this.infoManageForm = ref)}
            id={infoManageModal.id}
          />
          <div className="text-center">
            <Button type="primary" onClick={this.handleInfoManageFormSubmit}>
              保存
            </Button>
            <span>&emsp;</span>
            <Button onClick={this.handleCloseInfoManageModal}>取消</Button>
          </div>
        </Modal>
      </>
    );
  }
}

export default BaseCrudList;
