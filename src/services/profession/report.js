import request from '@utils/request';

export function audit(payload) {
  return request('/a/news/updateStatusById', {
    method: 'post',
    data: payload,
  });
}

export function update(payload) {
  return request('/a/news/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/a/news/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/a/news/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/a/news/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/a/news/delById', {
    method: 'post',
    data: payload,
  });
}
