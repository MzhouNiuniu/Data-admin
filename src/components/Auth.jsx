import React from 'react';
import Redirect from 'umi/redirect';
import { connect } from 'dva';

function getRouteInfo(routeMap, path) {
  let route = null;
  for (let k in routeMap) {
    route = routeMap[k];
    if (route.pathRegex.test(path)) {
      return route;
    }
  }
  return null;
}

const Auth = props => {
  const { user, global, location } = props;
  const { routeMap } = global;
  const { currentUser, authRouteMap } = user;

  const isLogin = currentUser && currentUser._id;
  if (!isLogin) {
    return <Redirect to="/Login" />;
  }

  const routeInfo = getRouteInfo(routeMap, location.pathname);
  if (!routeInfo) {
    return <Redirect to="/Exception/404" />;
  }

  const isAuth = authRouteMap.hasOwnProperty(routeInfo.fullPath);
  if (user.isRouteLoaded && !isAuth) {
    return <Redirect to="/Exception/403" />;
  }

  return <>{props.children} </>;
};

export default connect(({ user, global }) => ({
  user,
  global,
}))(Auth);
