const app = getApp()
const getLastedNotice = require('../../common').getLastedNotice;
Page({
  data: {
    stations: [],
    ori_stations:[],
    go:true,
    message:''
  },
  onLoad(){
    wx.showTabBar({
      animation: true,
    })
    var that = this;
    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'stations'
      }
      }).then((resp) => {
        console.log('get stations '+JSON.stringify(resp.result))
        this.setData({
          ori_stations: resp.result.data
        });
        this.getNotice();
        that.gotable()
        
        console.log('get cartitem'+JSON.stringify(resp))
    }).catch((e) => {
        console.log(e);
    });
  },
  onReady(){
    console.log('get ori '+this.data.ori_stations)
    this.gotable()
    this.getNotice();
  },

  tomap () {
    wx.switchTab({
      url: '../map/map'
    })
  },
  gotable () {
    let goStations = this.data.ori_stations.filter(function(item){
      return item.detail.go !== undefined
    }).sort(function(a,b){
      return a.detail.go.order - b.detail.go.order
    }).map(function(item){
      return {"name":item.name,"departure_time":item.detail.go.time}
    })

    console.log('cal statiosn '+JSON.stringify(goStations))

    this.setData({
      stations: goStations,
      go: true
    })
  },
  async getNotice (){
    console.log("getNotice");
    var message = await getLastedNotice();
    this.setData({
      message: message
    })
  },
  backtable () {
    let backStations = this.data.ori_stations.filter(function(item){
      return item.detail.back !== undefined
    }).sort(function(a,b){
      return a.detail.back.order - b.detail.back.order
    }).map(function(item){
      return {"name":item.name,"departure_time":item.detail.back.time}
    })


    this.setData({
      stations: backStations,
      go: false
    })
  },
  onShareAppMessage () {
    return {
      title: '看看校车到哪里了',
      imageUrl: '../../asset/logo.jpg'
    }
  }
})
