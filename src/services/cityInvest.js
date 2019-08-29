import request from '@/utils/request';

export function update(payload) {
  return request('/a/cityInvest/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/cityInvest/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/cityInvest/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/cityInvest/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/cityInvest/delById', {
    method: 'post',
    data: payload,
  });
}
