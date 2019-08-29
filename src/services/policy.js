import request from '@/utils/request';

export function update(payload) {
  return request('/a/statute/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/statute/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/statute/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/statute/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/statute/delById', {
    method: 'post',
    data: payload,
  });
}
