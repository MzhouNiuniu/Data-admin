import { routerRedux } from 'dva/router';

function findIndex(routes, path) {
  return routes.findIndex(item => item.path === path);
}

/**
 * todo 将/Form/123、/Form/456类似的进行合并（即存储路由正则，不存储实际路径）
 * */
export default {
  namespace: 'routeTab',
  state: {
    currentPath: '',
    routes: [],
  },
  effects: {
    *closeTab(
      {
        payload: { path },
      },
      { select, put },
    ) {
      const state = yield select(state => state.routeTab);
      const index = findIndex(state.routes, path);
      if (index < 0) return;

      const routes = state.routes.slice();
      routes.splice(index, 1);
      yield put({
        type: 'saveTab',
        payload: {
          routes,
        },
      });
    },
    *clearTab(action, { select, put }) {
      const { routes } = yield select(state => state.routeTab);
      if (routes.length === 1 && routes[0].path === '/') {
        return;
      }

      yield put({
        type: 'saveTab',
        payload: {
          routes: [],
        },
      });

      yield put(routerRedux.push('/'));
    },
    *removeTab(
      {
        payload: { path, location },
      },
      { select, put },
    ) {
      const state = yield select(state => state.routeTab);
      const routes = state.routes.slice();
      const index = findIndex(routes, path);
      routes.splice(index, 1);

      yield put({
        type: 'saveTab',
        payload: {
          routes,
        },
      });

      // 关闭自身
      if (path === location.pathname) {
        const newRoute = routes[index - 1];
        if (newRoute) {
          yield put(routerRedux.push(newRoute.path));
        } else {
          yield put(routerRedux.push('/'));
        }
      }
    },
  },
  reducers: {
    addTab(state, { payload }) {
      const { routes, currentPath } = state;
      const { path } = payload;
      // 点击自身
      if (path === currentPath) {
        return state;
      }
      const newState = {
        ...state,
        currentPath: path,
      };

      const index = findIndex(routes, path);
      if (index >= 0) {
        return newState;
      }
      newState.routes = routes.concat(payload);
      return newState;
    },
    saveTab(
      state,
      {
        payload: { routes },
      },
    ) {
      return {
        ...state,
        routes,
      };
    },
    closeOtherTab(state) {
      const { routes, currentPath } = state;
      const index = findIndex(routes, currentPath);
      return {
        ...state,
        routes: [routes[index]],
      };
    },
  },
};
