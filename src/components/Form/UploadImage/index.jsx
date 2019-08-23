import './index.scss'
import React from 'react'
import propTypes from 'prop-types'
import {Upload, Icon, Modal} from 'antd'

const getLocaleFileList = props => {
  const {multiple, value} = props
  if (!value) {
    return []
  }
  let fileList = value.split(',')
    .map((item, index) => ({
      uid: -(index + 1),
      url: item,
      status: 'done',
    }))
  if (fileList.length === 0) {
    return fileList
  }
  return !multiple ? [fileList[0]] : fileList
}
export default class UploadImageMultiple extends React.Component {
  static propTypes = {
    disabled: propTypes.bool,
    value: propTypes.oneOfType([propTypes.string, propTypes.array]),
    multiple: propTypes.bool,
    maxlength: propTypes.number,
    action: propTypes.string,
    onChange: propTypes.func,
  }
  static defaultProps = {
    disabled: false,
    action: '/api/upload',
    multiple: false, // 是否可上传多张图片
    maxlength: 3,
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isInit && this.props.value) {
      this.setState({
        isInit: true,
        fileList: getLocaleFileList(this.props),
      })
    }
  }

  state = {
    isInit: false,
    value: this.props.value,
    fileList: getLocaleFileList(this.props),
    slide: {
      visible: false,
      src: '',
    },
  }

  handleSlideOpen = file => {
    this.setState({
      slide: {
        visible: true,
        src: this.getFileUrl(file),
      },
    })
  }

  handleSlideClose = () => {
    this.setState({
      slide: {
        visible: false,
        src: '',
      },
    })
  }

  getFileUrl = file => {
    return file.url || (file.response ? file.response.url : '')
  }

  handleChange = ({fileList}) => {
    this.setState({
      fileList,
    })
    if (this.props.onChange && this.isAllFileLoaded(fileList)) {
      const value = fileList.reduce((acc, file) => (acc += this.getFileUrl(file) + ',', acc), '')
        .slice(0, -1)
      this.props.onChange(value)
    }
  }

  /**
   * flags
   * isAllFileLoaded - 是否所有的文件都上传完成
   * isShowUploadBtn - isShowUploadBtn
   * */
  isAllFileLoaded = (fileList = this.state.fileList) => {
    if (fileList.length === 0) return true
    return fileList.every(item => item.status === 'done')
  }

  isShowUploadBtn = () => {
    if (!this.props.multiple) {
      return this.state.fileList.length === 0
    }
    return this.state.fileList.length < this.props.maxlength
  }

  render() {
    const {fileList, slide} = this.state
    const {multiple, action, disabled} = this.props
    return (
      <>
        <Modal
          visible={slide.visible}
          footer={null}
          style={{top: '18%'}}
          onCancel={this.handleSlideClose}
        >
          <img alt="slide" style={{width: '100%'}} src={slide.src}/>
        </Modal>
        <Upload
          disabled={disabled}
          listType="picture-card"
          action={action}
          fileList={fileList}
          onChange={this.handleChange}
          onPreview={this.handleSlideOpen}
          multiple={multiple}
        >
          {
            this.isShowUploadBtn() && (
              <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
              </div>
            )
          }
        </Upload>
      </>
    )
  }
}
