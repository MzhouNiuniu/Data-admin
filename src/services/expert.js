import request from '@/utils/request';

export function update(payload) {
  return request('/expert/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/expert/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/expert/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/expert/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/expert/delById', {
    method: 'post',
    data: payload,
  });
}
