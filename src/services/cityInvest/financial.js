/* 融资信息 */
import request from '@/utils/request';

export function update(payload) {
  return request('/financialing/updateById', {
    method: 'post',
    data: payload,
  });
}

export function detail(payload) {
  return request('/financialing/getDetails?id=' + payload);
}

export function create(payload) {
  return request('/financialing/publish', {
    method: 'post',
    data: payload,
  });
}

export function list(payload) {
  return request('/financialing/getList', {
    params: payload,
  });
}

export function del(payload) {
  return request('/financialing/delById', {
    method: 'post',
    data: payload,
  });
}
