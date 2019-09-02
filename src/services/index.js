/**
 * # 默认请求前缀
 * - 修改config/baseUrl.base，例如请求路径为 http://192.168.9.105:3000/collaborate/delById，只需要写 request('/collaborate/delById')
 * # 不使用前缀
 * - 使用绝对路径，例如请求路径为 http://192.168.9.105:8888/collaborate/delById，只需要写 request('http://192.168.9.105:8888/collaborate/delById')
 * # 请求静态文件
 * - 使用基础的request，import { baseRequest } from '@/utils/request';
 * */
