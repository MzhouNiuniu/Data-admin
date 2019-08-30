import request from '@/utils/request';

export function update(payload) {
  return request('/news/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/news/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/news/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/news/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/news/delById', {
    method: 'post',
    data: payload,
  });
}
