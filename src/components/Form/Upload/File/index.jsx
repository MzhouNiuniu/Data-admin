import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import { Upload, Icon, Button } from 'antd';
import api from '@services/api';
import publicServices from '@services/public';

// todo 重构
/**
 * 服务端存储格式：{name:'f1',url:'xxx.com/xxx.png'} 或者 [{name:'f1',url:'xxx.com/xxx.png'}]
 * 2019年8月27日
 * 修改为存储字符串，格式为：xxx.com/xxx.png，多个以逗号分隔 xxx.com/xxx.png,xxx.com/xxx.png
 * 2019年8月28日
 * add propTypes.valueType
 * string：xxx.com/xxx.png xxx.com/xxx.png,xxx.com/xxx.png
 * array：xxx.com/xxx.png [xxx.com/xxx.png,xxx.com/xxx.png]
 * raw：{name:'f1',url:'xxx.com/xxx.png'} [{name:'f1',url:'xxx.com/xxx.png'}]
 * 2019年8月29日
 * add propTypes.valueSplitSymbol
 * 当 valueType === 'string' && multiple === true时，值的分割符号（不能动态设置）
 * */
export default class UploadImage extends React.Component {
  static propTypes = {
    useBase64: propTypes.bool,
    disabled: propTypes.bool,
    value: propTypes.oneOfType([propTypes.string, propTypes.object, propTypes.array]),
    multiple: propTypes.bool,
    valueType: propTypes.oneOf(['string', 'array', 'raw']),
    valueSplitSymbol: propTypes.string, // valueType === 'string'
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
    // valueType: 'string',
    valueType: 'raw',
    action: api.fileServer.uploadFile,
    listType: 'text',
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

  valueSplitSymbol = this.props.valueSplitSymbol || ',';

  isInit = false;

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      fileList: this.getLocaleFileList(),
    };
    if (this.props.useBase64) {
      this.valueSplitSymbol = '#';
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
    } else {
      this.customRequest = ({ file, onSuccess, onError }) => {
        publicServices.uploadFile(file).then(res => {
          if (res.status === 200) {
            onSuccess(res.data);
          } else {
            onError(new Error(res.message));
            // 每次失败后，就移除所有失败的文件
            this.setState({
              fileList: this.state.fileList.filter(item => item.status !== 'error'),
            });
          }
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
    const { multiple, valueType } = this.props;
    let { value } = this.props;
    if (!value) {
      return [];
    }
    if (!multiple) {
      if (valueType === 'raw') {
        value = [value];
      } else {
        if (valueType === 'array') {
          value = value[0];
        }

        value = [this.transToFileInfo(value)];
      }
    } else {
      if (valueType === 'string') {
        value = value.split(this.valueSplitSymbol).map(this.transToFileInfo);
      } else if (valueType === 'array') {
        value = value.map(this.transToFileInfo);
      }
    }
    const fileList = value.map((item, index) => ({
      uid: -(index + 1),
      name: item.name,
      url: item.url,
      // thumbUrl: item.url, // IE8/9 不支持浏览器本地缩略图展示（Ref），可以写 thumbUrl 属性来代替。
      status: 'done',
    }));
    return fileList;
  }

  /* 可以存储在服务端的数据格式 */
  transToFileInfo = url => {
    return {
      name: url,
      url: url,
    };
  };
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

    const { multiple, onChange, valueType } = this.props;
    const { getFileInfo } = this;
    if (!fileList.length) {
      onChange(undefined);
      return;
    }

    let value = null;
    // 将数据改为字符串
    if (!multiple) {
      value = getFileInfo(fileList[0]);
      if (valueType !== 'raw') {
        value = value.url;
      }
    } else {
      if (valueType === 'raw') {
        value = fileList.map(item => getFileInfo(item));
      } else {
        value = fileList.map(item => getFileInfo(item).url);
      }
      if (valueType === 'string') {
        value = value.join(this.valueSplitSymbol);
      }
    }
    onChange(value);
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
