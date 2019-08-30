import request from '@/utils/request';

export function update(payload) {
  return request('/magazine/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/magazine/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/magazine/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/magazine/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/magazine/delById', {
    method: 'post',
    data: payload,
  });
}
