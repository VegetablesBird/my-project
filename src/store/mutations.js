import {
  SAVE_GEOHASH,
  RECORD_ADDRESS
} from './mutation-types.js'

export default {
  // 保存geohash地址
  [SAVE_GEOHASH] (state, geohash) {
    state.geohash = geohash
  },

  // 记录当前经度纬度
  [RECORD_ADDRESS] (state, {
    latitude,
    longitude
  }) {
    state.latitude = latitude
    state.longitude = longitude
  }
}
