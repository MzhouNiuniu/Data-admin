import request from '@/utils/request';

export default {
  update(payload) {
    return request('/about/publish', {
      method: 'post',
      data: payload,
    });
  },
  detail() {
    return request('/about/getDetails');
  },
};
