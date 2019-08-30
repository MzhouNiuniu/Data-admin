/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import './index.scss';
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '@/assets/logo.svg';
import PageLoading from '@components/PageLoading';
import RouteTab from '@components/RouteTab';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { RouteContext } from '@ant-design/pro-layout';

/**
 * use Authorized check all menu item
 */

function filterDynamicPathRoute(routeMap, routes) {
  return routes;
}

const footerRender = (_, defaultDom) => {
  return null;
};

const BasicLayout = props => {
  const { dispatch, children, user, settings, global } = props;
  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/loadRoutes',
      });
      dispatch({
        type: 'settings/getSetting',
      });

      // todo 如果不是从登录过来的，就请求最新的用户信息，如头像变动等（多个设备之间切换时）
      // if (!props.user.isFromLoginPage) {
      //   dispatch({
      //     type: 'user/refresh',
      //   });
      // }
    }
  }, []);
  /**
   * init variables
   */
  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  const menuDataRender = () => user.routes;
  const menuItemRender = (menuItemProps, defaultDom) => {
    if (menuItemProps.isUrl) {
      return defaultDom;
    }

    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
  };
  const breadcrumbRender = (routers = []) => {
    // filterDynamicPathRoute(global.routeMap, routers) // 实现此函数，可修复这种情况：【主页/文章管理/新增文章/编辑文章】
    return [
      {
        path: '/',
        breadcrumbName: formatMessage({
          id: 'menu.home',
          defaultMessage: 'Home',
        }),
      },
      ...routers,
    ];
  };
  const breadcrumbItemRender = (route, params, routes, paths) => {
    return <span>{route.breadcrumbName}</span>;
  };
  const rightContentRender = rightProps => <RightContent {...rightProps} />;
  return (
    <ProLayout
      logo={logo}
      collapsed={global.collapsed}
      formatMessage={formatMessage}
      onCollapse={handleMenuCollapse}
      menuDataRender={menuDataRender}
      menuItemRender={menuItemRender}
      breadcrumbRender={breadcrumbRender}
      itemRender={breadcrumbItemRender}
      footerRender={footerRender}
      rightContentRender={rightContentRender}
      {...props}
      {...settings}
    >
      {user.isRouteLoaded ? (
        <>
          <div className="basic-layout__route-tab">
            <RouteContext.Consumer>{value => <RouteTab context={value} />}</RouteContext.Consumer>
          </div>
          {children}
        </>
      ) : (
        <PageLoading />
      )}
    </ProLayout>
  );
};

export default connect(({ global, user, settings }) => ({
  global,
  user,
  settings,
}))(BasicLayout);
