import React from 'react';
import MozillaPdf from '@components/MozillaPdf';

class PdfPreview extends React.Component {
  render() {
    return (
      <MozillaPdf
        src="/demo.pdf"
        style={{
          width: '100%',
          height: '760px',
        }}
      />
    );
  }
}

export default PdfPreview;
