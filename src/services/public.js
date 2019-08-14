import request from '@/utils/request'

export default {
  getGeoJSON(code) {
    return request(`/geo-json/${code}_full.json`)
  },
}
