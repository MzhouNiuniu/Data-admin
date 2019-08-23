import './index.scss';
import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';
import { withRouter } from 'dva/router';
import { Tabs, Icon, Dropdown, Menu, Alert } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import ContextMenu from '../ContextMenu';

@connect(({ routeTab, global }) => ({
  routeTab,
  global,
}))
@withRouter
class RouteTab extends React.PureComponent {
  static propTypes = {
    context: propTypes.object,
  };

  prevPath = '';

  constructor(props) {
    super(props);
    this.addCurrentRouteToTab();
    this.props.history.listen((location, action) => {
      if (action === 'REPLACE') {
        this.removePrevRouteInTab();
      }

      this.addCurrentRouteToTab(location);
      this.prevPath = location.pathname;
    });
  }

  removePrevRouteInTab = () => {
    this.props.dispatch({
      type: 'routeTab/closeTab',
      payload: {
        path: this.prevPath,
      },
    });
  };

  addCurrentRouteToTab = (location = this.props.location) => {
    const {
      dispatch,
      global: { routeMap },
    } = this.props;
    let routeInfo = findRouteInfoByPath(routeMap, location.pathname);

    if (routeInfo) {
      dispatch({
        type: 'routeTab/addTab',
        payload: {
          path: location.pathname,
          name: routeInfo.locale
            ? formatMessage({
                id: routeInfo.locale,
                defaultMessage: routeInfo.name,
              })
            : routeInfo.name,
        },
      });
    }
  };

  handleTabClick = key => {
    const { currentPath } = this.props.routeTab;
    if (key === currentPath) {
      return;
    }
    this.props.history.push(key);
  };

  handleTabEdit = (key, action) => {
    if (action !== 'remove') return;
    const { dispatch, location } = this.props;
    dispatch({
      type: 'routeTab/removeTab',
      payload: {
        path: key,
        location: location,
      },
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    switch (key) {
      case 'closeOtherTab':
        dispatch({
          type: 'routeTab/closeOtherTab',
        });
        break;
      case 'clearTab':
        dispatch({
          type: 'routeTab/clearTab',
        });
        break;
    }
  };

  render() {
    const {
      routeTab: { routes },
      location,
    } = this.props;

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="closeOtherTab">
          <Icon type="close-circle" />
          关闭其他标签页
        </Menu.Item>
        <Menu.Item key="clearTab">
          <Icon type="close-circle" />
          关闭所有标签
        </Menu.Item>
      </Menu>
    );
    return (
      <ContextMenu menu={menu}>
        <section className="component__route-tab clearfix">
          <Tabs
            hideAdd
            type="editable-card"
            onEdit={this.handleTabEdit}
            onTabClick={this.handleTabClick}
            activeKey={location.pathname}
          >
            {routes.map(item => (
              <Tabs.TabPane tab={item.name} key={item.path} />
            ))}
          </Tabs>
        </section>
      </ContextMenu>
    );
  }
}

export default RouteTab;

function findRouteInfoByPath(routeMap, path) {
  let k = null;
  for (k in routeMap) {
    if (routeMap[k].pathRegex.test(path)) break; // 或者不中断，改为以最后一个匹配到的为准
  }
  return routeMap[k];
}
