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
  login () {
    console.log('username:'+this.data.username+', password:'+this.data.password)
    if('admin' == this.data.username && '123456' == this.data.password){
      console.log('login success')
      this.tomap()
    }else{
      wx.showModal({
        title: '登录失败',
        showCancel:false,
        content:'用户名密码错误'
      })
    }
  },
  
  onShareAppMessage () {
    return {
      title: '快来使用LBS定位小工具',
      imageUrl: '../../asset/logo.png'
    }
  }
})
