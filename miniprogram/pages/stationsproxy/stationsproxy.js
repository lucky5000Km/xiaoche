const app = getApp()
Page({
  data: {
    stations: [{
     name: '未来领袖幼儿园',
     departure_time: '7:00' 
    },
  ],
  errmsg: '',
  'button_disable':true

  },
  onLoad(){
    console.log('load proxy...')
    wx.getStorage({
      key: 'token',
      success (res) {
        console.log(res.data)
        if(res.data.type === 'ADMIN'){
          wx.redirectTo({
            url: '../stations/stations',
          })
        }else if(res.data.type === 'PARENT'){
          wx.redirectTo({
            url: '../timetable/timetable',
          })
        }
      }
    })

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
  //检查有没有登录 
  validLogin(){
    wx.getStorage({
      key:"token",
      success(res){
        console.log('get login data :'+res.data)
        wx.cloud.callFunction({
          name: 'lbs_server',
          data: {
            type: 'user',
            username: res.data.username,
            password: res.data.password
          }
          }).then((resp) => {
            console.log('get user info '+JSON.stringify(resp))
            if(resp.result.data.length>0 ){
              wx.setStorage({
                key:"role",
                data:resp.result.data[0].type
              })

              wx.switchTab({
                url: '../map/map'
              })
            }else{
              //token 过期
              wx.navigateTo({
                url: '../login/login',
              })
            }
        }).catch((e) => {
            console.log(e);
        });
       
      
      },
      fail(){
        wx.navigateTo({
          url: '../login/login'
        })
      }
    })
  },
  getGroupNameFail(e){
    console.log('err:'+JSON.stringify(e))
  },
  tomap () {
    wx.setStorage({
      key:"role",
      data:"school"
    })
    wx.getStorage({
      key:"token",
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
