import request, { baseRequest } from '@/utils/request';

export default {
  getGeoJSON(code) {
    return baseRequest(`/geo-json/${code}_full.json`);
  },
};
