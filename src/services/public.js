import request, { baseRequest } from '@/utils/request';
import api from '@services/api';

export default {
  getGeoJSON(code) {
    return baseRequest(`/geo-json/${code}_full.json`);
  },
  uploadFile(file, fileName = 'File') {
    const data = new FormData();
    data.append(fileName, file);
    return baseRequest.post(api.fileServer.uploadFile, {
      requestType: 'form',
      data,
    });
  },
  uploadImage(file, fileName = 'File') {
    const data = new FormData();
    data.append(fileName, file);
    return baseRequest.post(api.fileServer.uploadFile, {
      requestType: 'form',
      data,
    });
  },
};
