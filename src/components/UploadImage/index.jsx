import './index.scss'
import React from 'react'
import propTypes from 'prop-types'
import { Upload, Icon, Modal } from 'antd'

const getLocaleFileList = props => {
  const { multiple, value } = props
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
    value: propTypes.oneOfType([propTypes.string, propTypes.array]),
    multiple: propTypes.bool,
    maxlength: propTypes.number,
    uploadUrl: propTypes.string,
    onChange: propTypes.func,
  }
  static defaultProps = {
    uploadUrl: '/api/upload',
    multiple: false, // 是否可上传多张图片
    maxlength: 3,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // todo 还是不行
    if (prevState.INIT_STATUS === 'none' && nextProps.value) {
      return {
        INIT_STATUS: 'wait',
        value: nextProps.value,
      }
    }
    return {
      value: nextProps.value,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 回显，只执行一次
    if (this.state.INIT_STATUS === 'wait' && prevProps.value !== this.state.value) {
      this.setState({
        INIT_STATUS: 'done',
        fileList: getLocaleFileList(this.props),
      })
      return
    }

    // 重置
    if (prevProps.value && !this.state.value) {
      this.setState({
        fileList: getLocaleFileList(this.props),
      })
      return
    }
  }

  state = {
    INIT_STATUS: 'none', // none、wait、done
    value: this.props.value,
    fileList: getLocaleFileList(this.props),
    slide: {
      visible: false,
      src: '',
    },
  }

  handlerSlideOpen = file => {
    this.setState({
      slide: {
        visible: true,
        src: this.getFileUrl(file),
      },
    })
  }

  handlerSlideClose = () => {
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

  handleChange = ({ fileList }) => {
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
    const { fileList, slide } = this.state
    const { multiple, uploadUrl } = this.props
    return (
      <>
        <Modal visible={slide.visible} footer={null} style={{ top: '18%' }}
               onCancel={this.handlerSlideClose}>
          <img alt="slide" style={{ width: '100%' }} src={slide.src}/>
        </Modal>
        <Upload
          listType="picture-card"
          action={uploadUrl}
          fileList={fileList}
          onChange={this.handleChange}
          onPreview={this.handlerSlideOpen}
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
