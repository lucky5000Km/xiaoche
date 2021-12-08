const request = require('request') // 引用request模块
const { key } = require('./config.json') // 引用地图信息配置

/**
 * 加载经纬度详细地址信息
 * @param {*} event
 */
async function location (event) {
  const res = { code: -1 } // 默认返回对象，code为-1
  try {
    const result = await call({ location: event.location }) // 调用request请求封装，传入经纬度信息
    if (result.formatted_addresses != null) { // 如果返回有推荐地址，正常返回信息
      res.code = 0
      res.formatted = result.formatted_addresses.recommend
      res.location = `${result.location.lat.toFixed(4)},${result.location.lng.toFixed(4)}`
      res.address = result.address
      res.adinfo = result.ad_info.name
      res.reallocal = result.location
    } else { // 没有推荐地址，说明不在国内，提示返回
      res.msg = '请确认经纬度在中国区域'
    }
  } catch (e) { // 有接口其他问题，直接返回提示
    res.msg = e
  }
  return res
}

/**
 * 加载地址的详细信息
 * @param {*} event
 */
async function address (event) {
  try {
    const locres = await call({ address: encodeURIComponent(event.address || '深圳市南山区深南大道10000号') }) // 传入编码后的地址，如果为空默认是腾讯大厦
    return await location({ location: `${locres.location.lat},${locres.location.lng}` }) // 如果正常返回，则找到坐标点了，传入经纬度信息方法，获取详细，上面的接口不管用
  } catch (e) {
    return { // 有接口其他问题，直接返回提示
      code: -1,
      msg: e
    }
  }
}

/**
 * 封装的请求
 * @param {*} obj 请求信息
 */
function call (obj) {
  let url = `https://apis.map.qq.com/ws/geocoder/v1/?key=${key}` // API地址，加key
  for (const i in obj) { // 根据参数拼接API地址
    url += `&${i}=${obj[i]}`
  }
  console.log(url) // 显示一下，备份
  return new Promise((resolve, reject) => {
    request({ // 开始请求
      method: 'GET',
      url: url
    }, function (error, response) {
      if (error) reject(error) // 有问题，返回异常
      try {
        const result = JSON.parse(response.body) // 正常，解析内容
        if (result.status === 0) { // 如果为0，则接口正常返回
          resolve(result.result)
        } else { // 如果不为0，则有问题，返回提示
          reject(result.message)
        }
      } catch (e) { // 解析失败或其他问题，返回异常信息
        reject(e)
      }
    })
  })
}
module.exports = {
  address,
  location
}
