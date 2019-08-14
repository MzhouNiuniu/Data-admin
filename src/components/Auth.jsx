import React from 'react'
import Redirect from 'umi/redirect'
import { connect } from 'dva'


function getRouteInfo(routeConfigMap, path) {
  let route = null
  for (let k in routeConfigMap) {
    route = routeConfigMap[k]
    if (route.pathRegex.test(path)) {
      return route
    }
  }
  return null
}


const Auth = props => {
  const { user, global, location } = props
  const { routeConfigMap } = global
  const { currentUser, authRouteMap } = user

  const isLogin = currentUser && currentUser.id
  if (!isLogin) {
    return (
      <Redirect to="/Login"/>
    )
  }

  const routeInfo = getRouteInfo(routeConfigMap, location.pathname)
  if (!routeInfo) {
    return (
      <Redirect to="/Exception/404"/>
    )
  }

  const isAuth = authRouteMap.hasOwnProperty(routeInfo.fullPath)
  if (user.isRouteLoaded && !isAuth) {
    return (
      <Redirect to="/Exception/403"/>
    )
  }

  return (
    <>
      {props.children}
    </>
  )
}

export default connect(
  ({ user, global }) => ({
    user,
    global
  })
)(Auth)
