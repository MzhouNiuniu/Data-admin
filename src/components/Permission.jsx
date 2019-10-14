import React from 'react';
import propTypes from 'prop-types';
import { connect } from 'dva';

/**
 * 1、只能登录之后使用
 * 2、服务端渲染需要判断一下
 * */

function Permission(props) {
  const storeRole = props.user.currentUser.role;
  // 未初始化role、或者role发生变化，重新生成roleRegex
  if (Permission.role === null || Permission.role !== storeRole) {
    Permission.role = storeRole;
    {
      let role = storeRole;
      if (!Array.isArray(role)) {
        role = [role];
      }
      Permission.roleRegex = new RegExp(`\\b(${role.join('|')})\\b(,)?`);
    }
  }
  if (!Permission.hasPermission(props.permission)) {
    return null;
  }
  return props.children;
}

Permission.propTypes = {
  permission: propTypes.array.isRequired,
};

Permission.role = null;
Permission.roleRegex = null;
Permission.hasPermission = function(permission) {
  // 未初始化
  if (this.roleRegex === null) {
    return false;
  }

  return this.roleRegex.test(permission.join(','));
};

export default connect(({ user }) => ({ user }))(Permission);
