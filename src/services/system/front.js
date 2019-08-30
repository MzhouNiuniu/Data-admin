import request from '@/utils/request';

export default {
  updateIndexConfig(payload) {
    return request('/indexConfig/publish', {
      method: 'post',
      data: payload,
    });
  },
  indexConfigDetail() {
    return request('/indexConfig/getDetails');
  },
};
