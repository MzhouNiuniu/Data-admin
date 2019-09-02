/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};

export { isAntDesignProOrDev, isAntDesignPro, isUrl };

export function forEachRouteStruct(routes, parent, cb) {
  routes.forEach(route => {
    if (!route.path) return;
    cb && cb(route, parent);
    if (route.routes) {
      forEachRouteStruct(route.routes, route, cb);
    }
  });
}

export function forEachUmiRouteStruct(routes, cb) {
  function main(routes, parent, prefix) {
    routes.forEach(route => {
      if (!route.path) return;
      cb && cb(route, parent, prefix);
      if (route.routes) {
        main(route.routes, route, route.path === '/' ? prefix : prefix + route.path + '/');
      }
    });
  }

  return main(routes, null, '', cb);
}

export function checkEventTargetIsInTarget(event, selectorOrElement) {
  const path = event.composedPath();
  for (let i = 0; i < path.length; i++) {
    if (path[i] === document.body) {
      return false;
    }
    if (path[i] === selectorOrElement || path[i].classList.contains(selectorOrElement)) {
      return true;
    }
  }
  return false;
}
