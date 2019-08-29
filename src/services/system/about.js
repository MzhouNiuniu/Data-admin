import request from '@/utils/request';

export default {
  update(payload) {
    return request('/a/about/publish', {
      method: 'post',
      data: payload,
    });
  },
  detail() {
    return request('/a/about/getDetails');
  },
};
