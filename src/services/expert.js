import request from '@/utils/request';

export function update(payload) {
  return request('/a/expert/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/expert/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/expert/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/expert/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/expert/delById', {
    method: 'post',
    data: payload,
  });
}
