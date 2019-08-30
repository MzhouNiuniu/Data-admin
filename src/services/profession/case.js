import request from '@utils/request';

export function update(payload) {
  return request('/researchScriptures/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/researchScriptures/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/researchScriptures/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/researchScriptures/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/researchScriptures/delById', {
    method: 'post',
    data: payload,
  });
}
