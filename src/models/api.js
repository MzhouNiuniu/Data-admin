// 算是通用API吧
import request from '@/utils/request';

export default {
  namespace: 'api',
  state: null,
  effects: {
    searchCompanyByKeywords({ payload }) {
      // http://192.168.9.105:3000/companyData/getMapSearch?keyWords=1

      return request('/companyData/getMapSearch', {
        params: {
          keyWords: payload,
        },
      });
    },
  },
};
