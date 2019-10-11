import React from 'react';
import propTypes from 'prop-types';
import { Icon, Modal } from 'antd';
import UploadFile from '../File';
import api from '@services/api';

class UploadImage extends React.Component {
  static propTypes = {
    action: propTypes.string,
  };

  static defaultProps = {
    action: api.fileServer.uploadImage,
  };

  state = {
    slide: {
      visible: false,
      src: '',
    },
  };

  handleSlideOpen = file => {
    this.setState({
      slide: {
        visible: true,
        src: file.thumbUrl || file.url,
      },
    });
  };

  handleSlideClose = () => {
    this.setState({
      slide: {
        visible: false,
        src: '',
      },
    });
  };

  beforeUpload = file => {
    // 在回显时获取不到文件type，所有简单认为如果没有type也是图片..
    return file.type === undefined || file.type === 'image/jpeg' || file.type === 'image/png';
  };

  render() {
    const { slide } = this.state;

    return (
      <section>
        <UploadFile
          {...this.props}
          useBase64={false}
          listType="picture-card"
          uploadBtnRender={() => (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          )}
          beforeUpload={this.beforeUpload}
          onPreview={this.handleSlideOpen}
        />
        <Modal
          destroyOnClose
          visible={slide.visible}
          footer={null}
          style={{ top: '18%' }}
          onCancel={this.handleSlideClose}
        >
          <img alt="slide" style={{ width: '100%' }} src={slide.src} />
        </Modal>
      </section>
    );
  }
}

export default UploadImage;
