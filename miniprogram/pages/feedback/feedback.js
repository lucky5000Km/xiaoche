// pages/feedback/feedback.js
import Toast from './../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
const callColudFun = require('../../common').callCouldFun;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newMessage:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  async submitFeedback(){
    Toast.loading({
      message: '保存中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    if(this.data.newMessage === ''|| this.data.newMessage === undefined){
      Toast.clear();
      Toast.fail("新公告必填");
      return;
    }
    try{
      await callColudFun('addFeedback',{message: this.data.newMessage});
      Toast.clear();
      Toast({
        type: 'success',
        message: '保存成功',
        forbidClick: true,
        onClose: ()=>{
          wx.navigateBack({
            delta: 1
          })
        }
      });
    }catch(err){
      Toast.clear();
      Toast.fail('发布失败:'+ err);
    }
  }
})