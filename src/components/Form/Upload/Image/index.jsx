import React from 'react';
import { Icon, Modal, Upload } from 'antd';
import UploadFile from '../File';

class UploadImage extends React.Component {
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
        src: file.thumbUrl,
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
    return file.type === 'image/jpeg' || file.type === 'image/png';
  };

  render() {
    const { slide } = this.state;

    return (
      <section>
        <UploadFile
          {...this.props}
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
