import 'braft-editor/dist/index.css';
import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import BraftEditor from 'braft-editor';
import request from '@/utils/request';

export default class Editor extends React.Component {
  static propTypes = {
    disabled: propTypes.bool,
    value: propTypes.string,
    mediaUrl: propTypes.string, // 资源上传地址
    onChange: propTypes.func,
  };
  static defaultProps = {
    disabled: false,
    // value: '',
    uploadUrl: '/api/upload',
    onChange() {},
  };

  state = {
    isInit: false,
    editorState: BraftEditor.createEditorState(this.props.value),
  };

  handleChange = editorState => {
    this.setState({ editorState });
  };

  handleBlur = editorState => {
    if (editorState.isEmpty()) {
      this.props.onChange('');
      return;
    }
    this.props.onChange(editorState.toHTML());
  };

  handleMediaUpload = param => {
    const { uploadUrl } = this.props;
    request(uploadUrl, {
      method: 'post',
    }).then(
      res => {
        param.success({
          url: res.url,
        });
      },
      err => {
        param.error({
          msg: err,
        });
      },
    );
  };

  componentDidUpdate(prevProps, prevState) {
    // 初始化
    if (!this.state.isInit && this.props.value) {
      this.setState({
        isInit: true,
        editorState: BraftEditor.createEditorState(this.props.value),
      });
    }
  }

  render() {
    const { editorState } = this.state;
    editorState.toHTML();
    return (
      <div className="braft-editor">
        <BraftEditor
          {...this.props}
          readOnly={this.props.disabled}
          value={editorState}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          media={{ uploadFn: this.handleMediaUpload }}
        />
      </div>
    );
  }
}
