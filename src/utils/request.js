/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import umiRequest, { extend } from 'umi-request';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import baseUrl from '@config/baseUrl';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  return response;
};
/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  // requestType: 'form',
  prefix: baseUrl.base,
});
request.use(async function AuthMiddleware(ctx, next) {
  await next();
  const { res } = ctx;
  if (res.code === 401) {
    try {
      const location = window.g_app._store.getState().routing.location;
      window.g_app._store.dispatch(
        routerRedux.push('/Login?redirect=' + location.pathname + location.search),
      );
    } catch (e) {
      window.g_app._store.dispatch(routerRedux.push('/Login'));
    }
  }
});
request.interceptors.request.use(function fixUndefinedDataMiddle(url, options) {
  const { data } = options;
  for (let k in data) {
    data[k] === undefined && (data[k] = null);
  }
  return options;
});
export default request;
export const baseRequest = umiRequest;

// debugger
// baseRequest.use(async function (ctx, next) {
//   await next();
// });
