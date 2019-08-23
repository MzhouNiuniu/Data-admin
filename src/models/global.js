import pathToRegexp from 'path-to-regexp';
import { forEachUmiRouteStruct } from '@utils/utils';
import { queryNotices } from '@/services/user';
import { getLocale, setLocale } from 'umi-plugin-react/locale';

import routes from '@/routes';

/**
 * route
 * @param {string} fullPath - 路由完整路径
 * @param {regex} pathRegex - 路由匹配正则，必须完全匹配，例如 /form，能匹配 /form，不能匹配 /form/123
 * */
function genRouteMap(routes) {
  const routeMap = {};
  forEachUmiRouteStruct(routes, function(route, parent, prefix) {
    if (route.path === '/' && route.routes) return;
    if (route.name) {
      if (parent && parent.name) {
        route.locale = 'menu.' + parent.name + '.' + route.name;
      } else {
        route.locale = 'menu.' + route.name;
      }
    }
    route.fullPath = prefix + route.path;
    route.pathRegex = pathToRegexp(route.fullPath);
    routeMap[route.fullPath] = route;
  });
  return routeMap;
}

const GlobalModel = {
  namespace: 'global',
  /**
   * @param {array} routes - 解析过的完整路由，类似服务端返回的user.routes
   * @param {object} routeMap - 本地所有路由的键值对
   * */
  state: {
    language: getLocale(),
    collapsed: false,
    notices: [],
    routes,
    routeMap: genRouteMap(routes),
  },
  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        ...state,
        collapsed: payload,
      };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    changeLang(state, { payload }) {
      setLocale(payload, false);
      return {
        ...state,
        language: payload,
      };
    },
  },
};
export default GlobalModel;
