import './Form.scss'
import React from 'react'
import { connect } from 'dva'
import { PageHeaderWrapper } from '@ant-design/pro-layout'

import {
  Card,
  message,
} from 'antd'
import FormWidget from './FormWidget'

class ArticleForm extends React.Component {
  state = {
    id: this.props.match.params.id
  }

  toList = () => {
    this.props.history.push('/Article/List')
  }

  handlerFormClose = () => {
    if (this.state.id) {
      message.success('编辑成功')
    } else {
      message.success('发布成功')
    }
    this.toList()
  }

  handlerFormCancel = () => {
    this.toList()
  }

  render() {
    const { id } = this.state
    return (
      <PageHeaderWrapper title={false}>
        <Card>
          <FormWidget id={id} onClose={this.handlerFormClose} onCancel={this.handlerFormCancel}/>
        </Card>
      </PageHeaderWrapper>
    )
  }
}


export default ArticleForm
