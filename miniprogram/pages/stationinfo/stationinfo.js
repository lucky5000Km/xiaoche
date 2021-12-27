const app = getApp() // 获取全局APP对象
let that = null // 页面this指针变量
Page({
  data: { // 默认数据
    _id: -1,
    latitude: 39.9086, // 地图中心纬度
    longitude: 116.3974, // 地图中心经度
    location: '', // 经纬度输入框
    address: '', // 地址输入框
    model: 0, // 模式转换 0-地址输入，1-经纬度输入
    marker: { // 地图当前标记点
      id: 0, // 标记点ID，不用变更
      latitude: 39.9086, // 标记点所在纬度
      longitude: 116.3974, // 标记点所在经度
      iconPath: '../../asset/local.png', // 标记点图标，png或jpg类型
      width: '20', // 标记点图标宽度
      height: '20' // 标记点图标高度
    },
    info: { // 地图点位信息
      address: '-', // 常规地址
      adinfo: '-', // 行政区
      formatted: '-', // 推荐地址
      location: '-' // 经纬度
    }
  },

  
  /**
   * 页面装载回调
   */
  onLoad (options) {
    console.log('get url params '+JSON.stringify(options)); 
    that = this // 
    that.setData({
      _id: options._id,
      info: { // 地图点位信息
        address: '-', // 常规地址
        adinfo: options.departure_time, // 行政区
        formatted: options.name, // 推荐地址
        location: options.latitude+','+options.longitude // 经纬度
      },
     
    })
    that.setInfo([parseFloat(options.latitude), parseFloat(options.longitude)]) // 设置经纬度信息
    /**
    wx.getLocation({ // 获取当前位置
      type: 'gcj02', // gcj02火星坐标系，用于地图标记点位
      success (res) { // 获取成功
        that.setInfo([parseFloat(res.latitude), parseFloat(res.longitude)]) // 设置经纬度信息
        that.getLocation() // 获取当前位置点
      },
      fail (e) { // 获取失败
        if (e.errMsg.indexOf('auth deny') !== -1) { // 如果是权限拒绝
          wx.showModal({ // 显示提示
            content: '你已经拒绝了定位权限，将无法获取到你的位置信息，可以选择前往开启',
            success (res) {
              if (res.confirm) { // 确认后
                wx.openSetting() // 打开设置页，方便用户开启定位
              }
            }
          })
        }
      }
    }) */
  },
  /**
   * 改变输入框类型
   */
  changemodel () {
    wx.getLocation({ // 获取当前位置
      type: 'gcj02', // gcj02火星坐标系，用于地图标记点位
      success (res) { // 获取成功
        that.setInfo([parseFloat(res.latitude), parseFloat(res.longitude)]) // 设置经纬度信息
        that.getLocation() // 获取当前位置点
      },
      fail (e) { // 获取失败
        if (e.errMsg.indexOf('auth deny') !== -1) { // 如果是权限拒绝
          wx.showModal({ // 显示提示
            content: '你已经拒绝了定位权限，将无法获取到你的位置信息，可以选择前往开启',
            success (res) {
              if (res.confirm) { // 确认后
                wx.openSetting() // 打开设置页，方便用户开启定位
              }
            }
          })
        }
      }
    })
  },
  /**
   * 点击地图
   * @param {*} e 页面载入参数
   */
  clickMap (e) {
    const { latitude, longitude } = e.detail // 获取点击的经纬度信息
    let data = {}
    if (that.data.model === 1) { // 如果模式在经纬度输入
      data = { location: `${latitude.toFixed(4)},${longitude.toFixed(4)}` } // 写当前经纬度信息
    }
    that.setInfo([latitude, longitude], 2, data) // 更改标记点信息
    that.getLocation({ latitude, longitude }) // 调用方法，传入经纬度，更新地址信息
    console.log(latitude+','+longitude)
  },
  /**
   * 地图范围改变
   * @param {*} e 页面载入参数
   */
  changeMap (e) {
    if (e.causedBy === 'drag' && e.type === 'end') { // 只有在手动拖动停止时，才执行动作
      const { latitude, longitude } = e.detail.centerLocation // 获取中心点位置
      that.setInfo([latitude, longitude], 1) // 不更改标记点，更新地图中心位置
    }
  },
  
  /**
   * 请求获取经纬度的详细信息
   * @param {object} data 经纬度信息
   */
  async getLocation (data = null) {
    /**const {
      latitude,
      longitude
    } = data || that.data // 如果传入为空，则使用data内数据
    await app.call({ // 发起云函数请求
      name: 'location', // 业务为location，获取经纬度信息
      data: { // 传入经纬度信息
        location: `${latitude},${longitude}`
      },
      load: false // 不显示加载loading，静默执行
    }).then((res) => { // 请求成功后
      that.setData({ // 将信息存储data数据
        info: res
      })
    })**/
  },
  /**
   * 请求获取地址的详细信息
   * @param {*} address 地址信息
   */
  async getAddress (address) {
    await app.call({ // 发起云函数请求
      name: 'address', // 业务为address，获取地址信息
      data: { // 传入地址信息
        address: address
      },
      tips: '查询中' // 加载提示为查询中
    }).then((res) => { // 请求成功
      that.setInfo([res.reallocal.lat, res.reallocal.lng], 0, { // 设置信息和地图中心点以及标记点
        info: res
      })
    })
  },
  /**
   * 监听输入框
   * @param {*} e 页面载入参数
   */
  oninput (e) {
    that.setData({
      [e.currentTarget.dataset.key]: e.detail.value
    })
  },
  uploadLocation(){
    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'stationsUpdate',
        _id: that.data._id,
        latitude: that.data.marker.latitude,
        longitude: that.data.marker.longitude
      }
      }).then((resp) => {
        
        console.log('update station '+JSON.stringify(resp))
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 3000,
          success(){
            wx.redirectTo({
              url: '../stations/stations'
            })
          }
        })
        
    }).catch((e) => {
        console.log(e);
    });
  },
  /**
   * 统一设置经纬度信息和额外信息
   * @param {array} pot 经纬度
   * @param {number} type 类型 0-都设置 1-只设置中心点 2-只设置标记点
   * @param {*} ext 额外的其他数据，一块带入
   */
  setInfo (pot = [39.9086, 116.3974], type = 0, ext = {}) {
    let data = { ...ext }
    if (type !== 1) { // 如果类型不为1
      data = Object.assign(data, { // 传入标记点
        'marker.latitude': pot[0],
        'marker.longitude': pot[1]
      })
    }
    if (type !== 2) { // 如果类型不为2
      data = Object.assign(data, { // 传入中心点
        latitude: pot[0],
        longitude: pot[1]
      })
    }
    that.setData(data)
  },
  onShareAppMessage () {
    return {
      title: '看看校车到哪里了',
      imageUrl: '../../asset/logo.jpg'
    }
  }
})
