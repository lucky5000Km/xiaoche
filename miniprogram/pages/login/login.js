const app = getApp()
let that = null
Page({
  data: {
    username: '',
    password:'',
    button_disable:false
  },
  onLoad(){
    that = this
  },
  onReady(){
  },

  usernameInput: function(e){
    this.setData({
      username: e.detail.value
    })
  },
  passwordInput: function(e){
    this.setData({
      password: e.detail.value
    })
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
  login () {
    console.log('username:'+this.data.username+', password:'+this.data.password)
    wx.showLoading({
      title: '登录中...',
    })
    that.setData({
      button_disable:true
    })
    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'user',
        username:this.data.username,
        password: this.data.password
      }
      }).then((resp) => {
        wx.hideLoading()
        console.log('get user '+JSON.stringify(resp))
        var user  = resp.result.data;
        if(resp.result.data.length == 1){
          wx.setStorage({
            key: "token",
            data: user[0],
            encrypt: true,
            success(){
              wx.getStorage({
                key:"token",
                encrypt: true,
                success(res){
                  console.log('get user info '+JSON.stringify(res.data))
                  wx.redirectTo({
                    url: '../index/index',
                  })
                }
              })
            }
          })
          
          
        }else{
          wx.showModal({
            title: '登录失败',
            showCancel:false,
            content:'用户名密码错误'
          })
          that.setData({
            button_disable: false
          })
        }
        
    }).catch((e) => {
        console.log(e);
    });


  },
  
  onShareAppMessage () {
    return {
      title: '看看校车到哪里了',
      imageUrl: '../../asset/logo.jpg'
    }
  }
})
