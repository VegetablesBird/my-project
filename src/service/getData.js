// import fetch from '../config/fetch'
// import { getStore } from '../config/mUtils'

/**
 * 获取首页默认地址
 */
export const cityGuess = (e) => e.$axios.get('/v1/cities', {
  params: {
    type: 'guess'
  }
})

/**
 * 获取首页热门城市
 */
export const hotcity = (e) => e.$axios.get('/v1/cities', {
  params: {
    type: 'hot'
  }
})

/**
 * 获取首页所有城市
 */
export const groupcity = (e) => e.$axios.get('/v1/cities', {
  params: {
    type: 'group'
  }
})

/**
 * 获取当前所在城市
 */
export const currentcity = (e, number) => e.$axios.get('/v1/cities/' + number)

/**
 * 获取搜索地址
 */
export const searchplace = (e, cityid, value) => e.$axios.get('/v1/pois', {
  params: {
    type: 'search',
    city_id: cityid,
    keyword: value
  }
})

/**
 * 获取msite页面食品分类列表
 */
export const msiteFoodTypes = (e, geohash) => e.$axios.get('/v2/index_entry', {
  params: {
    geohash,
    group_type: '1',
    'flags[]': 'F'
  }
})

export const getShopList = (e, latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', deliveryMode = '', support_ids = []) => {
  let supportStr = ''
  support_ids.forEach(item => {
    if (item.status) {
      supportStr += '&support_ids[]=' + item.id
    }
  })
  let data = {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id,
    'restaurant_category_ids[]': restaurant_category_ids,
    order_by,
    'delivery_mode[]': deliveryMode + supportStr
  }
  return e.$axios.get('/shopping/restaurants', {
    params: data
  })
}

export const msiteAddress = (e, geohash) => e.$axios('/v2/pois/' + geohash)

export const shopDetails = (e, shopId, latitude, longitude) => e.$axios('/shopping/restaurant/' + shopId, {
  params: {
    latitude,
    longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
  }
})

export const foodMenu = (e, restaurant_id) => e.$axios('/shopping/v2/menu', {
  params: {
    restaurant_id
  }
})
