const app = getApp()
Page({
  data: {
    username: '',
    password:'',
  },
  onLoad(){
    var that = this;
    
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

    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'user',
        username:this.data.username,
        password: this.data.password
      }
      }).then((resp) => {
        console.log('get user '+JSON.stringify(resp))
        if(resp.result.data.length == 1){
          if("ADMIN" === resp.result.data[0].type){
            this.tomap()
          }else{
            this.totime()
          }
          
        }else{
          wx.showModal({
            title: '登录失败',
            showCancel:false,
            content:'用户名密码错误'
          })
        }
        
    }).catch((e) => {
        console.log(e);
    });


  },
  
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  }
})
