const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
let that= null
Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    errmsg: '',
    button_disable:true,
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    openId:'',
    showUserInfo:false,
    kidName:''

  },
  wechatLogin(){
     //判断是否微信用户
     wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'getUser',
      }
      }).then((resp) => {
        console.log('get user info '+JSON.stringify(resp))
        if(resp.result.data.length == 0){
          that.getUserProfile()
        }else{
          that.validUser(resp.result.data)
        }
    }).catch((e) => {
        console.log(e);
        wx.showToast({
          title: '系统出错了，请稍候再试',
          icon:'error'
        })
    });// end valid wechat
    
    
  },
  getUserProfile(e) {
    wx.showModal({
      title: '提示',
      editable:true,
      placeholderText:'输入宝贝名字',
      //content: '这是一个模态弹窗',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定 %s ',res.content)
          if(res.content.length== 0 || res.content.length > 10){
            wx.showToast({ title: '请输入正确的名字', icon: 'error', duration: 2000 })   
          }else{
            that.setData({
              kidName: res.content
            })
            // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
            // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
            wx.getUserProfile({
              desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
              success: (res) => {
                that.setData({
                  userInfo: res.userInfo,
                  hasUserInfo: true
                })

                // add user to db
                wx.cloud.callFunction({
                  name: 'lbs_server',
                  data: {
                    type: 'addUser',
                    userInfo:res.userInfo,
                    kidName: that.data.kidName
                  }
                }).then((resp) => {
                  console.log('add user ok')
                  that.setData({
                    errmsg:'账号审核中，请耐心等待'
                  })
                  wx.setStorage({
                    key: "token",
                    encrypt: true,
                    data: res.userInfo,
                  })
                  
                  wx.showModal({
                    title: '温馨提示',
                    showCancel:false,
                    content:'信息同步完成，快快联系工作人员审核账号吧'
                  })
                }).catch((e) => {
                  wx.showModal({
                    title: '温馨提示',
                    showCancel:false,
                    content:'系统出问题了，联系下工作人员吧'
                  })
                console.log(e)
              });
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    


    
  },
  
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  onLoad(){
    that = this
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.validLogin()
    

  },
  //检查是否有群访问限制
  validGroup(){
    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'getGroupId'
      } 
     }).then((resp) => {
      console.log(JSON.stringify('get group id :'+JSON.stringify(resp)))
      if(resp.result.data.valid == 1 ){
        const configGroupId = resp.result.data.value
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
              console.log('get wechat group id :'+JSON.stringify(resp))
              const groupId = resp.result.weRunData.data.opengid ;
              if(configGroupId != groupId ){
                wx.showModal({
                  title: '哎呀',
                  content: '这个不能让你看哦'
                })
              }else{
                canAccess = true;
                that.setData({
                button_disable:false
              })
              }
              
              
            }).catch((e) =>{
                console.log(e)
            })


            },
            fail(res) { 
              console.log('fail...'+JSON.stringify(res)) 
              canAccess = false;
              if(resp.result.data.value != groupId ){
                wx.showModal({
                  title: '哎呀',
                  content: '没有访问权限'
                })
              }
            }

          })
      }else{
        canAccess = true
        that.setData({
          button_disable:false
        })
      }
      
     }).catch((e) =>{
        console.log(e)
     })
  },
  validUser(userList){
    if(userList.length>0 ){
      if(userList[0].disable){
        that.setData({
          errmsg: '当前账号不可用，请联系工作人员'
        })
      }else{
        wx.setStorageSync('role', userList[0].type)
        wx.setStorage({
          key: "token",
          encrypt: true,
          data:userList[0],
          success(){
            wx.switchTab({
              url: '../map/map'
            })
          },
          fail(e){
            wx.showToast({
              title: '系统出错了，请稍候再试',
              icon:'error'
            })
          }
        })
      }

    }else{
      //token 过期
      that.setData({
        showUserInfo: true
      })
    }
  },
  //检查有没有登录 
  validLogin(){
    wx.getStorage({
      key:"token",
      encrypt: true,
      success(res){
        console.log('get login data %s :',JSON.stringify(res.data))
        //验证用户名密码登录是否有效
        if(res.data.username && res.data.username != '' 
          && res.data.password && res.data.password != ''){
          wx.cloud.callFunction({
            name: 'lbs_server',
            data: {
              type: 'user',
              username: res.data.username,
              password: res.data.password
            }
            }).then((resp) => {
              console.log('get user info '+JSON.stringify(resp))
              that.validUser(resp.result.data)
          }).catch((e) => {
              console.log(e);
          });
        }

        if(res.data.openid != '' && (!res.data.username || res.data.username == '')){
           //判断是否微信用户
            wx.cloud.callFunction({
              name: 'lbs_server',
              data: {
                type: 'getUser',
              }
              }).then((resp) => {
                console.log('get user info '+JSON.stringify(resp))
                that.validUser(resp.result.data)
            }).catch((e) => {
                console.log(e);
                wx.showToast({
                  title: '系统出错了，请稍候再试',
                  icon:'error'
                })
            });// end valid wechat
        }
        

        
        
       
      
      },
      fail(e){
        that.setData({
          showUserInfo: true
        })
      }
    })
  },
  getGroupNameFail(e){
    console.log('err:'+JSON.stringify(e))
  },
  toLogin(){
    wx.navigateTo({
      url: '../login/login'
    })
  },
  tomap () {
    wx.setStorage({
      key:"role",
      data:"school"
    })
    wx.getStorage({
      key:"token",
      encrypt: true,
      success(res){
        console.log('get login data :'+res.data)
        if(res.data !=''){
          wx.navigateTo({
            url: '../map/map'
          })
        }
      },
      fail(){
        wx.navigateTo({
          //url: '../map/map'
          url: '../login/login'
        })
      }
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
      title: '看看校车到哪里了',
      imageUrl: '../../asset/logo.jpg'
    }
  }
})
