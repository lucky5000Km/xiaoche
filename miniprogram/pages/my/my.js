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
              url: '../login/login'
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
