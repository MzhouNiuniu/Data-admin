import request from '@/utils/request';

export function update(payload) {
  return request('/companyData/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/companyData/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/companyData/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/companyData/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/companyData/delById', {
    method: 'post',
    data: payload,
  });
}

/* financial 融资信息 */
// export * as financial from './financial';
// import * as financial from './financial';
//
// export { financial };
