import request from '@utils/request';

export function update(payload) {
  return request('/a/researchScriptures/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/researchScriptures/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/researchScriptures/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/researchScriptures/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/researchScriptures/delById', {
    method: 'post',
    data: payload,
  });
}
