const app = getApp()
Page({
  data: {
    stations: [{
     name: '未来领袖幼儿园',
     departure_time: '7:00' 
    },
  ],
  errmsg: 'nnn'

  },
  onLoad(){
    //微信群判断
    wx.getGroupEnterInfo({
      success(res) {
       console.log('get res '+JSON.stringify(res))
       wx.cloud.callFunction({
        name: 'lbs_server',
        data: {
          weRunData: wx.cloud.CloudID(res.cloudID), // 这个 CloudID 值到云函数端会被替换
          type: 'validGroup'
        } 
       }).then((resp) => {
        console.log(JSON.stringify(resp))
        if(resp.result.weRunData.data.opengid != 'GluMg4y5l73W8z1xLM2o7lz9h-S8' ){
          wx.showModal({
            title: '哎呀',
            content: '这个不能让你看哦'
          })
        }
        
       }).catch((e) =>{
          console.log(e)
       })


      },
      fail(res) { 
        console.log('fail...'+JSON.stringify(res)) 
      }

    })


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
  getGroupNameFail(e){
    console.log('err:'+JSON.stringify(e))
  },
  tomap () {
    wx.setStorage({
      key:"role",
      data:"school"
    })
    wx.navigateTo({
      url: '../map/map'
    })
  },
  totime () {
    wx.setStorage({
      key:"role",
      data:"student"
    })
    wx.navigateTo({
      url: '../timetable/timetable'
    })
  },
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  }
})
