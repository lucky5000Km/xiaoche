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
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
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
        that.gotable()
        wx.hideLoading();
        console.log('get cartitem'+JSON.stringify(resp))
    }).catch((e) => {
      wx.hideLoading()
      wx.showToast({
        title: '加载失败',
        icon:"error"
      })
        console.log(e);
    });
  },
  onReady(){
    console.log('get ori '+this.data.ori_stations)
    this.gotable()
  },

  tomap () {
    wx.switchTab({
      url: '../map/map'
    })
  },
  changeTab(){
    this.setData({
      go: !this.data.go
    })
    if(this.data.go){
      this.gotable();
    }else{
      this.backtable();
    }
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
