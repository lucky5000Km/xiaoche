const app = getApp()
const getUserType = require('./../../common').getUserType;
import Dialog from './../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
   userInfo:{},
   isManager: false,
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
          });
        }
    }).catch((e) => {
        console.log(e);
    });// end valid wechat
    this.isManagerCheck();
  },
  onReady(){
  },

  logout () {
    Dialog.confirm({
      title: '',
      message: '确认要退出吗？',
    })
      .then(() => {
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
      })
      .catch(() => {
        // on cancel
      });

  },
  toNoticePage(){
    this.pageRouter.navigateTo({
      url: './../notice/notice'
    });
  },

  toFeedbackPage(){
    this.pageRouter.navigateTo({
      url: './../feedback/feedback'
    })
  },
  
  onShareAppMessage () {
    return {
      title: '看看校车到哪里了',
      imageUrl: '../../asset/logo.jpg'
    }
  },
  async isManagerCheck(){
    var userName = await getUserType();
    console.log('getUserName...',userName)
    this.setData({
      isManager: userName!== undefined &&(userName === 'ADMIN' || userName ==='DRIVE')
    })
  },

  toStationManagePage(){
    this.pageRouter.navigateTo({
      url: './../station-manage/station-manage'
    })
  }

})
