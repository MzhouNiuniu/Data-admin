// import * as cookies from 'tiny-cookie'
import { forEachRouteStruct } from '@utils/utils';
import * as userService from '@/services/user';
import { routerRedux } from 'dva/router';

/**
 * cookie后端设置
 * 有cookie：读取localStorage的用户数据
 * 无cookie：等价于未登录
 */
function getLocaleUser() {
  // let token = document.cookie.split(';')
  //   .find(item => /session=/.test(item));
  // if (!token) {
  //   document.cookie = 'session=-1;expires=' + new Date(null).toUTCString();
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   return {};
  // }
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem('TEST_USER') || '{}');
  } catch (e) {
    currentUser = {};
  }
  return currentUser;
}

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: getLocaleUser(),
    isFromLoginPage: false,

    // 路由 + 权限
    isRouteLoaded: false,
    routes: [],
    authRouteMap: {}, // 权限支持，键为路由path，值为1，树遍历优化
  },
  effects: {
    *login({ payload, autoLogin, redirect }, { call, put }) {
      const response = yield call(userService.login, payload);
      if (response.status !== 200) {
        return Promise.reject(response);
      }
      console.log(response);
      yield put({
        type: 'saveLoginFrom',
        payload: true,
      });
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
      if (autoLogin) {
        yield put({
          type: 'saveLocaleUser',
        });
      }
      yield put(routerRedux.replace(redirect || '/'));
    },
    *register({ payload }, { call, put }) {
      const response = yield call(userService.register, payload);
      if (response.status !== 200) {
        return Promise.reject(response);
      }

      // 注册完成，调用登录接口，减少重复逻辑
      yield put({
        type: 'login',
        payload,
        autoLogin: true,
      });
    },

    *changePwd({ payload }, { call }) {
      const response = yield call(userService.changePwd, payload);
      console.log(response);
    },

    *logout({ payload }, { call, put }) {
      // yield call(userService.logout, payload)
      yield put({
        type: 'clearLocaleUser',
      });
      yield put(
        routerRedux.replace({
          pathname: '/Login',
        }),
      );
    },

    *create({ payload }) {
      return userService.register(payload);
    },
    *list({ payload }) {
      return userService.list(payload);
    },
    *detail({ payload }) {
      return userService.detail(payload);
    },
    *update({ id, payload }) {
      return userService.update(id, payload);
    },
    *updateById({ id, payload }) {
      return userService.updateById(id, payload);
    },

    *del({ payload }) {
      return userService.del(payload);
    },
    *refresh(_, { select, call, put }) {
      const currentUser = yield select(state => state.user.currentUser);
      const response = yield call(userService.detail, currentUser._id);
      if (response.code === 200) {
        // yield put({
        //   type: 'saveCurrentUser',
        //   payload: response.data,
        // })
      } else {
      }
    },
    *loadRoutes(_, { select, call, put }) {
      const globalRouteMap = yield select(state => state.global.routeMap);
      const currentUser = yield select(state => state.user.currentUser);
      // console.log(currentUser)

      const response = yield call(userService.loadRoutes);
      if (response.code !== 200) return;
      const routes = response.data;
      const authRouteMap = {};

      forEachRouteStruct(routes, null, function(route, parent) {
        if (parent) {
          route.path = parent.path + '/' + route.path;
        }

        if (globalRouteMap[route.path]) {
          const localeRoute = globalRouteMap[route.path];
          // fix ant.design attrs
          route.hideInMenu = localeRoute.hideInMenu;
          if (localeRoute.locale) {
            route.locale = localeRoute.locale;
          }
        }

        authRouteMap[route.path] = 1;
        // fix，侧边栏需要用children
        if (route.routes) {
          route.children = route.routes;
        }
      });
      yield put({
        type: 'saveRoutes',
        payload: {
          isRouteLoaded: true,
          routes,
          authRouteMap,
        },
      });
    },
  },
  reducers: {
    saveCurrentUser(state, { payload = {} }) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          ...payload,
        },
      };
    },
    saveLoginFrom(state, { payload }) {
      // payload boolean
      return {
        ...state,
        isFromLoginPage: payload,
      };
    },
    saveLocaleUser(state) {
      localStorage.setItem('TEST_USER', JSON.stringify(state.currentUser));
      return state;
    },
    clearLocaleUser(state, action) {
      localStorage.removeItem('TEST_USER');
      return {
        ...state,
        currentUser: {},
      };
    },
    saveRoutes(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // 内置
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
