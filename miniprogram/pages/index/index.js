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
    let canAccess= false;
    let that = this;

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



    

    if(canAccess){
      //获取站点列表
    wx.cloud.callFunction({
      name: 'lbs_server',
      data: {
        type: 'stations'
      }
      }).then((resp) => {
        console.log('get stations '+JSON.stringify(resp.result))
        this.setData({
          stations: resp.result.data
        });
        
        console.log('get cartitem'+JSON.stringify(resp))
    }).catch((e) => {
        console.log(e);
    });
   
    }
    


  },
  getGroupNameFail(e){
    console.log('err:'+JSON.stringify(e))
  },
  tomap () {
    wx.setStorage({
      key:"role",
      data:"school"
    })
    wx.navigateTo({
      //url: '../map/map'
      url: '../login/login'
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
