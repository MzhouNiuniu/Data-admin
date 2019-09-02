import request from '@/utils/request';

export function update(payload) {
  return request('/collaborate/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/collaborate/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/collaborate/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/collaborate/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/collaborate/delById', {
    method: 'post',
    data: payload,
  });
}
