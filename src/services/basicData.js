import request from '@/utils/request';

export function update(payload) {
  return request('/basicData/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/basicData/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/basicData/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/basicData/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/basicData/delById', {
    method: 'post',
    data: payload,
  });
}
