import React from 'react';
import { withRouter } from 'dva/router';
import { Button } from 'antd';

const LinkButton = withRouter(function(props) {
  props = { ...props };
  if (props.to) {
    const { history, to } = props;
    props.onClick = function() {
      history.push(to);
    };
  }

  delete props.to;
  delete props.staticContext;
  delete props.match;
  delete props.location;
  delete props.history;
  return <Button {...props} />;
});
export default LinkButton;
