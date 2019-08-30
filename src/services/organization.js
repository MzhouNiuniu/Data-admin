import request from '@/utils/request';

export function update(payload) {
  return request('/organization/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/organization/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/organization/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/organization/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/organization/delById', {
    method: 'post',
    data: payload,
  });
}
