import { callCouldFun } from '../../common';
import Toast from './../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
const getLastedNotice = require('../../common').getLastedNotice;
const callColudFun = require('../../common').callCouldFun;
// pages/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      noticeMessage: '',
      newMessage:'',
  },

  async searchCurrentNoticeMessage(){
    var message = await getLastedNotice();
    this.setData({
      noticeMessage: message
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.searchCurrentNoticeMessage();
  },
  async saveNotice(){
    Toast.loading({
      message: '保存中...',
      forbidClick: true,
      loadingType: 'spinner',
    });
    console.log(this.data.newMessage,"newwww")
    if(this.data.newMessage === ''|| this.data.newMessage === undefined){
      Toast.clear();
      Toast.fail("新公告必填");
      return;
    }
    try{
      console.log("this.newMessage",this.data.newMessage);
      await callColudFun('addNotice',{message: this.data.newMessage});
      Toast.clear();
      Toast({
        type: 'success',
        message: '保存成功',
        forbidClick: true,
        onClose: ()=>{
          console.log("1312");
          wx.navigateBack({
            delta: 1
          })
        }
      });
    }catch(err){
      Toast.clear();
      Toast.fail('发布失败:'+ err);
    }
  },
})