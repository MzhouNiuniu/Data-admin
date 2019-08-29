import React from 'react';
import propTypes from 'prop-types';

/**
 * 1、只能登录之后使用
 * 2、服务端渲染需要判断一下
 * */
let userPermissionRegex = null;

export function hasPermission(permission) {
  // if (window.isSSR) {
  //   return false;
  // }

  if (userPermissionRegex === -1) {
    // 用户未设置权限
    return false;
  }
  if (!userPermissionRegex) {
    const userPermission = window.g_app._store.getState().user.currentUser.permission || ['admin']; // mock admin
    if (!userPermission || !userPermission.length) {
      userPermissionRegex = -1;
      return false;
    }
    userPermissionRegex = new RegExp(`\\b(${userPermission.join('|')})\\b(,)?`);
  }
  return userPermissionRegex.test(permission.join(','));
}

function Permission(props) {
  if (!hasPermission(props.permission)) {
    return null;
  }
  return props.children;
}
Permission.propTypes = {
  permission: propTypes.array.isRequired,
};
export default Permission;