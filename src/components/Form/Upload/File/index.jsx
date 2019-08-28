import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import { Upload, Icon, Button } from 'antd';

/**
 * 原来在服务端存储：{name:'f1',url:'xxx.com/xxx.png'} 或者 [{name:'f1',url:'xxx.com/xxx.png'}]
 * 后来修改为存储字符串：xxx.com/xxx.png，多个以逗号分隔 xxx.com/xxx.png,xxx.com/xxx.png
 * */
export default class UploadImage extends React.Component {
  static propTypes = {
    useBase64: propTypes.bool,
    disabled: propTypes.bool,
    value: propTypes.oneOfType([propTypes.string, propTypes.object, propTypes.array]),
    multiple: propTypes.bool,
    maxlength: propTypes.number,
    action: propTypes.string,
    listType: propTypes.string,
    getFileUrl: propTypes.func,
    uploadBtnRender: propTypes.func,
    onChange: propTypes.func,
    onPreview: propTypes.func,
    beforeUpload: propTypes.func,
  };
  static defaultProps = {
    useBase64: false,
    disabled: false,
    multiple: false, // 是否可上传多张图片
    action: '/api/upload',
    listType: 'picture',
    maxlength: 3,
    getFileUrl(file) {
      return file.url || (file.response ? file.response.url : '');
    },
    uploadBtnRender() {
      return (
        <Button>
          <Icon type="upload" /> Upload
        </Button>
      );
    },
  };

  isInit = false;

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      fileList: this.getLocaleFileList(),
    };
    if (this.props.useBase64) {
      const getBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(file);
      };
      this.customRequest = function({ file, onSuccess }) {
        setTimeout(() => {
          getBase64(file, function(base64) {
            onSuccess({
              name: file.name,
              status: 'done',
              url: base64,
            });
          });
        });
        return {
          abort() {
            console.log('upload progress is aborted.');
          },
        };
      };
    }
  }

  // customRequest = () => { }

  getLocaleFileList() {
    const { multiple } = this.props;
    let { value } = this.props;
    if (!value) {
      return [];
    }

    // 修复将数据改为字符串之后的问题
    if (typeof value === 'string') {
      value = value.split(',').map(item => ({
        name: item,
        url: item,
      }));
    } else {
      if (!multiple) {
        value = [value];
      }
    }

    const fileList = value.map((item, index) => ({
      uid: -(index + 1),
      name: item.name,
      url: item.url,
      thumbUrl: item.url, // fix image
      status: 'done',
    }));
    return fileList;
  }

  getFileInfo = file => {
    return {
      name: file.name,
      url: this.props.getFileUrl(file),
    };
  };

  handleChange = ({ fileList }) => {
    /* fix ant.design beforeUpload error */
    if (!this.props.beforeUpload) {
      this.setState({
        fileList: fileList,
      });
    } else {
      this.setState({
        fileList: fileList.filter(this.props.beforeUpload),
      });
    }

    if (!this.props.onChange) return;
    if (!this.checkIsAllFileLoaded(fileList)) return;
    // 内部改变
    this.isInit = true;

    const { multiple, onChange } = this.props;
    const { getFileInfo } = this;
    if (!fileList.length) {
      onChange(undefined);
      return;
    }

    // 将数据改为字符串
    if (!multiple) {
      onChange(getFileInfo(fileList[0]).url);
    } else {
      onChange(fileList.map(item => getFileInfo(item).url).join(','));
    }
  };

  /* 是否所有的文件都上传完成 */
  checkIsAllFileLoaded = (fileList = this.state.fileList) => {
    if (fileList.length === 0) return true;
    return fileList.every(item => item.status === 'done');
  };

  checkIsShowUploadBtn = () => {
    if (!this.props.multiple) {
      return this.state.fileList.length === 0;
    }
    return this.state.fileList.length < this.props.maxlength;
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.isInit && this.props.value) {
      this.isInit = true;
      this.setState({
        fileList: this.getLocaleFileList(),
      });
    }
  }

  render() {
    const { fileList } = this.state;
    const {
      multiple,
      action,
      disabled,
      listType,
      beforeUpload,
      onPreview,
      uploadBtnRender,
    } = this.props;
    return (
      <Upload
        disabled={disabled}
        multiple={multiple}
        listType={listType}
        action={action}
        fileList={fileList}
        customRequest={this.customRequest}
        beforeUpload={beforeUpload}
        onPreview={onPreview}
        onChange={this.handleChange}
      >
        {this.checkIsShowUploadBtn() && uploadBtnRender()}
      </Upload>
    );
  }
}
