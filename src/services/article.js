import request from '@/utils/request';

export function update(id, payload) {
  return request('/mock/mock-update/article/' + id, {
    method: 'put',
    data: payload,
  });
}

export function detail(payload) {
  return request('/mock/mock-detail/article/' + payload);
}

export function create(payload) {
  return request('/mock/mock-form/article', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/mock/mock-list/article', {
    params: payload,
  });
}

export function del(payload) {
  return request('/mock/mock-delete/article', {
    method: 'delete',
    data: payload,
  });
}
