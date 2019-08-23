import request from '@/utils/request';

export function audit(payload) {
  return request('/a/organization/updateStatusById', {
    method: 'post',
    data: payload,
  });
}

export function update(payload) {
  return request('/a/organization/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/organization/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/organization/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/organization/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/organization/delById', {
    method: 'post',
    data: payload,
  });
}
