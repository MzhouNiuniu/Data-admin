import 'braft-editor/dist/index.css';
import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import BraftEditor from 'braft-editor';
import request from '@/utils/request';

function extractFirstPicFromBraft(editor) {
  const mediaList = editor.getFinderInstance().getItems();
  const firstImg = mediaList.find(item => item.type === 'IMAGE');
  if (!firstImg) {
    return null;
  }
  return firstImg.url;
}

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

  isInit = false;
  editor = null;
  state = {
    editorState: BraftEditor.createEditorState(this.props.value),
  };
  getMediaList = () => {
    return this.editor.getFinderInstance().getItems();
  };
  getFirstImage = () => {
    const firstImg = this.getMediaList().find(item => item.type === 'IMAGE');
    if (!firstImg) {
      return null;
    }
    return firstImg.url;
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
    if (!this.isInit && this.props.value) {
      this.isInit = true;
      this.setState({
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
          ref={ref => (this.editor = ref)}
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
