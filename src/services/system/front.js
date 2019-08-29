import request from '@/utils/request';

export default {
  updateIndexConfig(payload) {
    return request('/a/indexConfig/publish', {
      method: 'post',
      data: payload,
    });
  },
  indexConfigDetail() {
    return request('/a/indexConfig/getDetails');
  },
};
