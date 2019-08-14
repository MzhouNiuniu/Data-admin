import request from '@/utils/request'


export async function update(id, payload) {
  return request('/mock/mock-update/article/' + id, {
    method: 'put',
    data: payload,
  })
}

export async function detail(payload) {
  return request('/mock/mock-detail/article/' + payload)
}

export async function create(payload) {
  return request('/mock/mock-form/article', {
    method: 'post',
    data: payload,
  })
}

export async function list(payload) {
  return request('/mock/mock-list/article', {
    params: payload,
  })
}

export async function del(payload) {
  return request('/mock/mock-delete/article', {
    method: 'delete',
    data: payload,
  })
}




