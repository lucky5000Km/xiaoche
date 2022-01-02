const app = getApp() // 获取全局APP对象
let that = null // 页面this指针变量
let total = 0 //站点数量
let count = 0;
Page({
  data: { // 默认数据
    lastUpdateLocationDate: null,
    latitude: 40.06445, // 地图中心纬度
    longitude: 116.36602, // 地图中心经度
    location: '', // 经纬度输入框
    address: '', // 地址输入框
    model: 0, // 模式转换 0-地址输入，1-经纬度输入
    role:'PARENT',
    marker: { // 地图当前标记点
      id: 0, // 标记点ID，不用变更
      latitude: 40.06445, // 标记点所在纬度
      longitude: 116.36602, // 标记点所在经度
      iconPath: '../../asset/local.png', // 标记点图标，png或jpg类型
      width: '20', // 标记点图标宽度
      height: '20' // 标记点图标高度
    },
    markers: [],
    polyline:[{
      points: [

      ],
      color: '#DC143C',
      width:5,
      dottedLine: true
    }]
   
  },

  // 获取位置信息
  getWxLocation() {
    wx.showLoading({
      title: '定位中...',
      mask: true,
    })
    return new Promise((resolve, reject) => {
      const _locationChangeFn = (res) => {
        console.log('location change', res)
        wx.hideLoading()
        wx.offLocationChange(_locationChangeFn)
      }
      wx.startLocationUpdate({
        success: (res) => {
          wx.onLocationChange(_locationChangeFn)
          resolve()
        },
        fail: (err) => {
          reject()
        }
      })
    })
  },

  getLastLocation(){
    let isOpen = false
    wx.getStorage({
      key: 'open_time',
      success (res) {
        console.log(res.data)
        var date = new Date()
        var items = res.data.value
        for(var e in items){
          console.log('e:'+e)
          var begin = items[e].begin.split(':')
          var beginTime = date.setHours(begin[0],begin[1],0);
          var end = items[e].end.split(':')
          var endTime = date.setHours(end[0],end[1],0);
          var now = new Date().getTime()
          if(now >= beginTime && now <= endTime){

            console.log('命中运营时间')
            //begin
            wx.cloud.callFunction({
              name: 'lbs_server',
              data: {
                type: 'locations'
              }
              }).then((resp) => { 
                console.log('get locations'+JSON.stringify(resp))
                var schoolbus = {
                  'latitude' : resp.result.data.lat,
                  'longitude' : resp.result.data.lon,
                  'iconPath': '../../asset/bus.png',
                  'zIndex': 100
                }
                var newMarkers =  this.data.markers
                if(total == newMarkers.length){
                  newMarkers.push(schoolbus)
                }else{
                  newMarkers.pop()
                  newMarkers.push(schoolbus)
                }
                this.setData({
                  markers: newMarkers
                })
                
        
            }).catch((e) => {
                console.log(e);
            });
            //end


            break
          } 
        }
      }
    })


    count++

  },

  /**
   * 页面装载回调
   */
  onShow () {
    that = this // 设置页面this指针到全局that
       //设置屏幕常亮
       wx.setKeepScreenOn({
        keepScreenOn: true
      })
    this.setData({
      lastUpdateLocationDate: new Date()
    })

   

    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'stations'
      }
      }).then((resp) => { 
        let stationList = []
        let res = resp.result.data;
        for(var i=0;i<res.length;i++){
          stationList[i] = res[i];
          stationList[i].callout = {
            content: res[i].name,
            padding: 10,
            display: 'ALWAYS',
            textAlign: 'center'
          }
        }

        total = stationList.length
        this.setData({
          markers: stationList,
        })      
        console.log('get cartitem'+JSON.stringify(resp))
    }).catch((e) => {
        console.log(e);
    });


    wx.getLocation({ // 获取当前位置
      type: 'gcj02', // gcj02火星坐标系，用于地图标记点位
      success (res) { // 获取成功
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
    });
    this.getWxLocation()

   
    wx.getStorage({
      key: 'role',
      success (res) {
        if('PARENT' === res.data){
          that.getLastLocation()
          setInterval(() => {
            that.getLastLocation()
            console.log('count:'+count)
          }, 5*1000);
        }else if('DRIVER' === res.data){
          console.log('get role of driver ,begin to upload position')
            that.setData({
              role: 'SCHOOL'
            })
           //更新校车位置
            wx.onLocationChange(function(res) {
              console.log('location change'+that.data.lastUpdateLocationDate+','+new Date(), res)
              var current = new Date()
              var diff = (current - that.data.lastUpdateLocationDate) / 1000
              if(diff >= 5){
                that.setData({
                  lastUpdateLocationDate: current
                })
                wx.cloud.callFunction({
                  name: 'lbs_server',
                  data: {
                    type: 'syncLocation',
                    lat: res.latitude,
                    lon: res.longitude
                  }
                  }).then((resp) => {           
                    console.log('get sync location'+JSON.stringify(resp))
                }).catch((e) => {
                    console.log(e);
                });
              }else{
                console.log('do not update location')
              }
              
            })//end update
        }
      }
    })
    

  },

  
  
  
  /**
   * 请求获取经纬度的详细信息
   * @param {object} data 经纬度信息
   */
  async getLocation (data = null) {
    const {
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
  /**
   * 改变输入框类型
   */
  changemodel () {
    that.setData({
      model: that.data.model === 0 ? 1 : 0 // 如果为0则设置1，如果为1则设置0
    })
  },
  onShareAppMessage () {
    return {
      title: '看看校车到哪里了',
      imageUrl: '../../asset/logo.jpg'
    }
  }
})
