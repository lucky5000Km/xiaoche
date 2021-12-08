const app = getApp()
Page({
  data: {
    stations: [{
     name: '未来领袖幼儿园',
     departure_time: '7:00' 
    }
  ]
  },
  onLoad(){
    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'stations'
      }
      }).then((resp) => {
        console.log('get stations '+JSON.stringify(resp.result))
        this.setData({
          stations: resp.result.data
        });
        
        console.log('get cartitem'+JSON.stringify(resp))
    }).catch((e) => {
        console.log(e);
    });

    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'stationsAdd'
      }
      }).then((resp) => {       
        console.log('get cartitem'+JSON.stringify(resp))
    }).catch((e) => {
        console.log(e);
    });


  },
  tomap () {
    wx.navigateTo({
      url: '../map/map'
    })
  },
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  }
})
