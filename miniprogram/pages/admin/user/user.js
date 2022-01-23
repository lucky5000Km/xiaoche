// pages/admin/user/user.js
const {callCouldFun} = require("./../../../common");
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    userList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserList()
  },
  async getUserList(){
    var result =   await callCouldFun("userList",{});
    console.log('get result of user %s',JSON.stringify(result))
    this.setData({
      userList: result.result.data
    })
  },
  async switchEnableUser(e) {
   console.log('get the swith value %s , id %s',e.detail.value,e.target.dataset.item._id)
   var result = await callCouldFun('updateUserStat',{id:e.target.dataset.item._id,disable:!e.detail.value})
   console.log('update result %s',JSON.stringify(result))
  

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})