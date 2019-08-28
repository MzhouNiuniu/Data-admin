import request from '@utils/request';

export function update(payload) {
  return request('/a/researchReport/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/researchReport/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/researchReport/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/researchReport/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/researchReport/delById', {
    method: 'post',
    data: payload,
  });
}
