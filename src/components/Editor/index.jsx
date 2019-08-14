import 'braft-editor/dist/index.css'
import './index.scss'
import React from 'react'
import propTypes from 'prop-types'
import BraftEditor from 'braft-editor'
import request from '@/utils/request'

export default class Editor extends React.Component {
  static propTypes = {
    value: propTypes.string,
    mediaUrl: propTypes.string, // 资源上传地址
    onChange: propTypes.func,
  }
  static defaultProps = {
    value: '',
    uploadUrl: '/api/upload',
    onChange() {
    },
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value === prevState.value) return null
    return {
      value: nextProps.value,
      editorState: BraftEditor.createEditorState(nextProps.value)
    }
  }

  state = {
    value: this.props.value,
    editorState: BraftEditor.createEditorState(this.props.value)
  }

  handlerChange = editorState => {
    this.setState({ editorState })
  }

  handlerBlur = editorState => {
    let value = editorState.toHTML()
    if (value === '<p></p>') {
      value = ''
      editorState = BraftEditor.createEditorState(value)
    }
    this.setState({
      value,
      editorState,
    })
    this.props.onChange(value)
  }

  handlerMediaUpload = param => {
    const { uploadUrl } = this.props
    request(uploadUrl, {
      method: 'post'
    })
      .then(
        res => {
          param.success({
            url: res.url,
          })
        },
        err => {
          param.error({
            msg: err
          })
        }
      )
  }

  render() {
    return (
      <div className="braft-editor">
        <BraftEditor
          {...this.props}
          value={this.state.editorState}
          onChange={this.handlerChange}
          onBlur={this.handlerBlur}
          media={{ uploadFn: this.handlerMediaUpload }}
        />
      </div>
    )

  }
}
