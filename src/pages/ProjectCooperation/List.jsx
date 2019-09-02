import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import './List.scss';
import { Card, Table, Button, Form, Input, message, Modal, Drawer, Tooltip, Select  } from 'antd';
import ProTable from '@components/Table/index'
import constant from '@constant';
import AuditButton from '@components/project/AuditButton';
import StickButton from '@components/project/StickButton';
import LinkButton from '@components/LinkButton';
import FormWidget from './FormWidget';

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`Selected: ${value}`);
}

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
      e.preventDefault();
      this.props.onSubmit(e, this.props.form);
    },
    onReset: e => {
      e.preventDefault();
      this.props.onReset(e, this.props.form);
    },
    
  };
  render() {
    const { onSubmit, onReset } = this.state;
    const { form } = this.props;
    const size = 'default';
    return (
      <div className="search-bar">
        <Form layout="inline" onSubmit={onSubmit}>
          <Form.Item label="项目名称">
            {form.getFieldDecorator('keyWords')(<Input placeholder="请输入项目名称" />)}
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

const renderBatchOperatorBar = (props) => {
  return (
    <>
      <span>&emsp;</span>
      <Button type="danger" onClick={props.handleDelItemBatch}>
        批量删除
      </Button>
    </>
  );
};


@connect()
class List extends React.Component {
  // table的假数据
  columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: ''
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
        return (
          <img src={row.Tphotos} width="90px" height="90px" />
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (text, row, index) => {
        return (
          <> 
            <AuditButton 
            row={row}
            api="/a/collaborate/updateStatusById"
            status={row.status}
            finallyCallback={this.loadDataSource}
            />
            <span>&emsp;</span>
            <StickButton 
            row={row}
            api="/a/collaborate/stickById"
            status={row.stick}
            finallyCallback={this.loadDataSource}
            />
            <span>&emsp;</span>
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
      }
    }
  ];
  defaultPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };
  pagination = JSON.parse(JSON.stringify(this.defaultPagination));
  searchForm = null;
  state={
    selectRows: [],
    dataSource: [],
    params: {
        page: 1,
        limit: 10,
        keyWords: ''
    },
    formWidgetModal: {
      visible: false,
      row: null,
    },
  }
  componentDidMount() {
    this.loadDataSource(this.state.params);
  }
  render() {
    const { dataSource, formWidgetModal, selectRows } = this.state;
    const { columns, pagination } = this;
    return (
      <Card className="page__list">
        <SearchForm
         ref={ref => (this.searchForm = ref)}
         onSubmit={this.queryList}
         />
        <LinkButton type="primary" to="Form">
              新增项目
        </LinkButton>
        {selectRows.length > 0 && <renderBatchOperatorBar  handleDelItemBatch = {this.handleDelItemBatch}/>}
        <br/>
        <br/>
        <ProTable 
        columns={columns} 
        data={dataSource} 
        onSelectChange={this.saveSelectRows}
        pagination={pagination}
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
    )
  }



  // 获取请求的参数
  getParams = () => {
    const { pagination, searchForm } = this;
    const page = page || pagination.current;
    const size = size || pagination.pageSize;
    const params = {
      page,
      limit: size,
      ...searchForm.getFieldsValue(),
    };
    return params;
  }
  // 加载列表
  loadDataSource = (params = {
    page: 1,
    limit: 10,
    keyWords: ''
  }) => {
    const { dispatch } = this.props;
    const { pagination } = this;
    dispatch({
      type: 'ProjectCooperation/list',
      payload: params,
    }).then( res => {
        if (res.status !== 200) {
          message.error('系统异常，请联系管理员！');
          return
        }
        const data = res.data;
        const dataSource = data.docs.map(this.rowPipe);
        pagination.current = data.page;
        pagination.pageSize = data.limit;
        pagination.total = data.total;
        this.setState({
          dataSource,
        });
    })
  }
  // 获取被勾选的row
  saveSelectRows = (key, rows) => {
    this.setState({
      selectRows: rows
    })
  }
  // 搜索
  queryList = (e, form) => {
    this.setState({
      params: this.getParams()
    }, () => {
      this.loadDataSource(this.state.params)
    })
  }
   /* 处理dataSource中的数据项 */
  rowPipe = row => {
    if (row.avatar) {
      row.avatar = row.avatar.split(',')[0];
    }
    row.cnStatus = constant.public.status.audit[row.status] || row.status;
    return row;
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