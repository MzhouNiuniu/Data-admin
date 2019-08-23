import React from 'react';

const MOZILLA_PDF_SRC =
  window.location.protocol + '//' + window.location.host + '/mozilla-pdf/web/viewer.html?file=';

const MozillaPdf = React.memo(props => {
  const src = MOZILLA_PDF_SRC + props.src;
  return <iframe scrolling="no" src={src} style={props.style} />;
});
export default MozillaPdf;
