/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout'
import React, { useEffect } from 'react'
import Link from 'umi/link'
import { connect } from 'dva'
import { formatMessage } from 'umi-plugin-react/locale'
import RightContent from '@/components/GlobalHeader/RightContent'
import logo from '../assets/logo.svg'
import PageLoading from '@components/PageLoading'

/**
 * use Authorized check all menu item
 */

function filterDynamicPathRoute(routeConfigMap, routes) {
  return routes
}

const footerRender = (_, defaultDom) => {
  return null
}

const BasicLayout = props => {
  const { dispatch, children, user, settings, global } = props
  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/loadRoutes',
      })
      dispatch({
        type: 'settings/getSetting',
      })

      // 后台更新用户信息，比如头像变动等
      // todo 2019年8月9日18:36:31未完成
      if (!props.user.isFromLoginPage) {
        dispatch({
          type: 'user/refresh',
        })
      }
    }
  }, [])
  /**
   * init variables
   */
  const handleMenuCollapse = payload => dispatch && dispatch({
    type: 'global/changeLayoutCollapsed',
    payload,
  })
  const menuDataRender = () => user.routes
  const menuItemRender = (menuItemProps, defaultDom) => {
    if (menuItemProps.isUrl) {
      return defaultDom
    }

    return <Link to={menuItemProps.path}>{defaultDom}</Link>
  }
  const breadcrumbRender = (routers = []) => {
    // filterDynamicPathRoute(global.routeConfigMap, routers) // 实现此函数，修复动态路由：【主页/文章管理/新增文章/编辑文章】
    return [
      {
        path: '/',
        breadcrumbName: formatMessage({
          id: 'menu.home',
          defaultMessage: 'Home',
        }),
      },
      ...routers,
    ]
  }
  const breadcrumbItemRender = (route, params, routes, paths) => {
    return <span>{route.breadcrumbName}</span>
  }
  const rightContentRender = rightProps => <RightContent {...rightProps} />
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
      {
        user.isRouteLoaded
          ? (
            <>
              {children}
            </>
          )
          : (
            <PageLoading/>
          )
      }
    </ProLayout>
  )
}

export default connect(({ global, user, settings }) => ({
  global,
  user,
  settings,
}))(BasicLayout)
