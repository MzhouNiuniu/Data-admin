import React from 'react';
import { connect } from 'dva';

@connect(({ global }) => ({ global }))
class Page extends React.Component {
  render() {
    console.log(this.props.global);
    return <section>Page</section>;
  }
}

export default Page;
