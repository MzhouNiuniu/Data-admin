import 'braft-editor/dist/index.css';
import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import BraftEditor from 'braft-editor';
import { baseRequest } from '@/utils/request';
import api from '@services/api';

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
    uploadUrl: api.fileServer.uploadFile,
    onChange() {},
  };

  isInit = false;
  editor = null;
  state = {
    editorState: BraftEditor.createEditorState(this.props.value),
  };
  getFirstImage = () => {
    let firstImageHTML = this.state.editorState.toHTML().match(/\<img.*?\/\>/);
    if (!firstImageHTML) {
      return null;
    }
    return firstImageHTML[0].match(/src="(.*?)"/)[1];

    /**
     * 回显时，无法获取媒体库
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
     * */
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

    const formData = new FormData();
    formData.append('File', param.file);

    baseRequest(uploadUrl, {
      method: 'post',
      data: formData,
    }).then(
      res => {
        console.log(res.data);
        if (res.status === 200) {
          param.success({
            url: res.data.url,
          });
        } else {
          param.error({
            msg: res.data.message,
          });
        }
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
