import request from '@/utils/request';

export function update(payload) {
  return request('/statute/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/statute/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/statute/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/statute/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/statute/delById', {
    method: 'post',
    data: payload,
  });
}
