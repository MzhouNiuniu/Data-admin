import request from '@/utils/request';

export default {
  create(payload) {
    return request('/a/about/publish', {
      method: 'post',
      data: payload,
    });
  },
  update(payload) {
    return request('/a/about/updateById', {
      method: 'post',
      data: payload,
    });
  },
};
