import request from '@/utils/request';

export function update(payload) {
  return request('/a/magazine/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/magazine/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/magazine/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/magazine/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/magazine/delById', {
    method: 'post',
    data: payload,
  });
}
