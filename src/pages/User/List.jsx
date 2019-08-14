import './List.scss'
import React from 'react'
import propTypes from 'prop-types'
import { connect } from 'dva'
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  message,
  Modal,
} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import FormWidget from './FormWidget'

@Form.create({
  name: 'search',
})
class SearchForm extends React.Component {
  static propTypes = {
    onSubmit: propTypes.func,
    onReset: propTypes.func,
  }
  static defaultProps = {
    onSubmit() {
    },
    onReset() {
    },
  }
  state = {
    onSubmit: e => {
      this.props.onSubmit(e, this.props.form)
    },
    onReset: e => {
      this.props.onReset(e, this.props.form)
    },
  }

  render() {
    const { onSubmit, onReset } = this.state
    const { form } = this.props
    return (
      <div className="search-bar">
        <Form layout="inline" onSubmit={onSubmit}>
          <Form.Item label="用户名查询">
            {form.getFieldDecorator('phone')(<Input placeholder="请输入用户名"/>)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <span>&emsp;</span>
            <Button onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

@connect()
@Form.create()
class UserList extends React.Component {
  state = {
    columns: [
      {
        width: 40,
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
      },
      {
        width: 100,
        title: '用户头像',
        dataIndex: 'avatar',
        render: (text, row, index) => {
          if (!row.avatar) {
            return (
              <p>暂无头像</p>
            )
          }
          return (
            <img src={row.avatar} width="100%"/>
          )
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
        title: 'Action',
        key: 'action',
        render: (text, row, index) => {
          return (
            <>
              <Button type="primary" onClick={() => this.editItemModal(index)}>编辑</Button>
              <span>&emsp;</span>
              <Button type="danger" onClick={() => this.delItem([row])}>删除</Button>
            </>
          )
        },
      },
    ],
    dataSource: [],
    selection: [],
    config: {
      bordered: true,
      size: 'middle',
      rowKey: 'id',
      rowSelection: {
        onChange: (keys, rows) => {
          this.setState({
            selection: rows,
          })
        },
      },
    },
    pagination: {
      current: 1,
      pageSize: 10,
      total: 1000,
    },
    editModal: {
      visible: false,
      index: null,
    },
    tableParams: {},
  }

  /* 处理dataSource中的数据项 */
  dataItemFormatPipe(item) {
    if (!item.avatar) return
    item.avatar = item.avatar.split(',')[0]
  }

  loadDataSource = (page, size) => {
    const { pagination } = this.state
    const { dispatch } = this.props
    page = page || pagination.current
    size = size || pagination.pageSize
    const params = {
      page,
      size,
      ...this.state.tableParams,
    }
    dispatch({
      type: 'user/list',
      payload: params,
    })
      .then(res => {
        if (res.code !== 200) return
        const dataSource = res.data

        dataSource.forEach(this.dataItemFormatPipe)
        this.state.pagination.current = page
        this.state.pagination.pageSize = size
        this.state.pagination.total = res.total
        this.setState({
          dataSource,
        })
      })
  }

  editItemModal = index => {
    this.state.editModal.visible = true
    this.state.editModal.index = index
    this.setState({})
  }

  closeEditModal = () => {
    this.state.editModal.visible = false
    this.setState({})
  }

  handlerEditModalClose = newRow => {
    message.success('编辑成功')
    this.dataItemFormatPipe(newRow)
    const { dataSource, editModal } = this.state
    const oldRow = dataSource[editModal.index]
    Object.assign(oldRow, newRow)
    this.setState({ dataSource })
    this.closeEditModal()
  }

  handlerEditModalCancel = () => {
    this.closeEditModal()
  }

  delItem = rows => {
    Modal.confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk: () => {
        const { dispatch } = this.props
        dispatch({
          type: 'user/del',
          payload: rows.map(item => item.id),
        })
          .then(res => {
            if (res.code !== 200) {
              message.warn(res.message)
              return
            }
            message.success(res.message)
            this.loadDataSource()
          })
      },
    })
  }

  delItemBatch = () => {
    this.delItem(this.state.selection)
  }

  componentWillMount() {
    this.loadDataSource()
  }

  handlerSearch = (e, form) => {
    e.preventDefault()
    form.validateFields((err, formData) => {
      if (err) {
        return
      }
      Object.assign(this.state.tableParams, formData)
      this.setState(() => ({}))
      this.loadDataSource(1, 10)
    })
  }

  handlerSearchReset = (e, form) => {
    form.resetFields()
    this.handlerSearch(e, form)
  }

  handlerTableChange = (pagination, filters, sorter) => {
    const otherParams = {}
    if (sorter.field) {
      otherParams['sort___' + sorter.field] = sorter.order === 'ascend' ? 'asc' : 'desc'
    }
    Object.assign(this.state.tableParams, otherParams)
    this.setState(() => ({}))
    this.loadDataSource(pagination.current, pagination.pageSize)
  }

  renderBatchOperatorBar = () => {
    return (
      <>
        <span>&emsp;</span>
        <Button type="danger" onClick={this.delItemBatch}>批量删除</Button>
      </>
    )
  }

  render() {
    const { columns, dataSource, config, pagination, selection, editModal } = this.state
    const editModalRow = editModal.index === null ? null : dataSource[editModal.index]
    return (
      <PageHeaderWrapper title={false}>
        <Card className="page__list">
          <SearchForm onSubmit={this.handlerSearch} onReset={this.handlerSearchReset}/>
          <div className="operator-bar">
            {selection.length > 0 && this.renderBatchOperatorBar()}
          </div>
          <Table columns={columns} dataSource={dataSource} {...config} pagination={pagination}
                 onChange={this.handlerTableChange}/>
          <Modal className="page__list__edit-modal" visible={editModal.visible} footer={null}
                 width="70%"
                 onCancel={this.handlerEditModalCancel}>
            {
              editModal.visible && editModalRow && (
                <FormWidget id={editModalRow.id}
                            onClose={this.handlerEditModalClose}
                            onCancel={this.handlerEditModalCancel}/>
              )
            }
          </Modal>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default UserList
