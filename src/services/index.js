/**
 * # 默认请求前缀
 * - 修改config/baseUrl.base，例如请求路径为 http://192.168.9.105:3000/collaborate/delById，只需要写 request('/collaborate/delById')
 * # 不使用前缀、请求静态文件
 * - 使用基础的request，import { baseRequest } from '@/utils/request';
 * - 例如请求路径为 http://192.168.9.105:8888/collaborate/delById，只需要写 baseRequest('http://192.168.9.105:8888/collaborate/delById')
 * - 例如请求静态文件，只需要写 baseRequest(`/geo-json/${code}_full.json`);
 * */
