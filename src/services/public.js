import request, { baseRequest } from '@/utils/request';
import api from '@services/api';

export default {
  getGeoJSON(code) {
    return baseRequest(`/geo-json/${code}_full.json`);
  },
  uploadFile(data) {
    return baseRequest(api.fileServer.uploadFile, {
      data,
    });
  },
  uploadImage() {
    return baseRequest(api.fileServer.uploadImage, {
      data,
    });
  },
};
