import request from '@utils/request';

export function update(payload) {
  return request('/researchReport/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/researchReport/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/researchReport/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/researchReport/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/researchReport/delById', {
    method: 'post',
    data: payload,
  });
}
