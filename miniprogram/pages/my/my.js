const app = getApp()
Page({
  data: {
   userInfo:{}
  },
  onLoad(){
    var that = this;
    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'getUser',
      }
      }).then((resp) => {
        console.log('get user info '+JSON.stringify(resp))
        if(resp.result.data.length>0){
          this.setData({
            userInfo:resp.result.data[0]
          })
        }
    }).catch((e) => {
        console.log(e);
    });// end valid wechat
  },
  onReady(){
  },

  logout () {
    wx.removeStorage({
      key: 'token',
      success(){
        wx.showToast({
          title: '退出成功',
          icon: 'success',
          duration: 3000,
          success(){
            wx.redirectTo({
              url: '../index/index'
            })
          }
        })
      }
    })

  },
  
  onShareAppMessage () {
    return {
      title: '看看校车到哪里了',
      imageUrl: '../../asset/logo.jpg'
    }
  }
})
