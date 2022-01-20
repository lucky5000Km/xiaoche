const {getStationsList,callCouldFun,getGoTable,getBackTable,toEditStationsPage} = require("./../../common");
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    habitList: [],
    allStationsInfo:[],
    adjustModel: false,
    goTab:true,
    effListMap:new Map(),
    // 当前拖拽项的克隆
    kelong: {
      name: '',
      icon: ''
    },
    startTop: 0, //拖拽开始时克隆项距离class=habitlist节点顶部边界的值
    top: 0,
    selectedIndex: -1, //被选择拖拽的项的index
    backupList: [], //用于备份数据
    showkelong: false, //是否显示克隆项
  },
 
  changeAdjustModel(){
    this.setData({
      adjustModel: !this.data.adjustModel,
      effListMap: new Map()
    })
    this.getStationsList();
  },
  changeTab(){
    this.setData({
      goTab: !this.data.goTab,
      effListMap: new Map()
    })
    this.setData({
      habitList: this.data.goTab ? getGoTable(this.data.allStationsInfo) : getBackTable(this.data.allStationsInfo)
    })
  },
  toStation(event){
    var item = event.currentTarget.dataset.item;
    toEditStationsPage(item,this.data.goTab);
  },
  toStationForNew(){
    toEditStationsPage(null,this.data.goTab);
  },
  async saveOrder(){
    wx.showLoading({
      title: "保存中",
      mask: true
    });
    if(this.data.effListMap.size<=0){
      wx.hideLoading();
      wx.showToast({
        title:"没有改动，无序调整",
        icon:"none"
      })
      return;
    }
    console.log("eff",this.data.effListMap);
    try{
      var result = await callCouldFun("updateOrder",{effListMap:Object.fromEntries(this.data.effListMap.entries()),goTap:this.data.goTab});
      console.log(result);
      wx.hideLoading();
      wx.showToast({
        "title":"保存成功",
        icon:"success"
      })
      this.getStationsList();
      this.setData({
        adjustModel:false,
      })
      return;
    }catch(err){
      wx.hideLoading();
      wx.showToast({
        title:"保存失败",
        icon:"error"
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStationsList();
  },

  async getStationsList(){
    wx.showLoading({
      title:"加载中"
    })
    var list = await getStationsList();
    wx.hideLoading();
    this.setData({
      allStationsInfo: list,
      effListMap: new Map(),
    })
    this.setData({
      habitList: this.data.goTab ? getGoTable(this.data.allStationsInfo) : getBackTable(this.data.allStationsInfo)
    })
  },
  
  // 拖拽开始
  dragStart(e) {
    // console.log("拖拽开始", e);
    var i = e.currentTarget.dataset.index // 当前拖拽项的索引index
    // 把当前拖拽项的内容复制给kelong
    var kelong = this.data.habitList[i]
     console.log("拖拽开始i=",i,"kelong=",kelong);
    var query = wx.createSelectorQuery(); // 创建节点查询器 quer
    //选择class=habitlist的节点，获取节点位置信息的查询请求
    query.select('.habitlist').boundingClientRect((rect) => {
    var top = e.changedTouches[0].clientY - rect.top - 30
     var startTop = top;
      this.setData({
        kelong: kelong,
        selectedIndex:i,
        showkelong: true,
        top:top,
        startTop:startTop
      })
    }).exec();
  },
  // 拖拽移动
  dragMove(e) {
    // console.log("拖拽移动", e);
    var query = wx.createSelectorQuery();
    var top =this.data.top
    query.select('.habitlist').boundingClientRect((rect) => {
     top = e.changedTouches[0].clientY - rect.top - 30
      if (top < 0) {
        // 顶部边界控制：控制克隆项不会拖拽出class=habitlist节点的顶部边界
       top = 0
      }
      this.setData({
        top:top
      })
    }).exec();
  },
  // 拖拽结束
  dragEnd(e) {
    // console.log("拖拽结束", e);
    var i = e.currentTarget.dataset.index
    var query = wx.createSelectorQuery();
    var kelong = this.data.kelong
    var habitList = this.data.habitList
    var that = this;
    query.select('.habitlist').boundingClientRect((rect) => {
      var top = e.changedTouches[0].clientY - rect.top - 30
      if (top > rect.height) {
        // 底部边界控制：控制克隆项拖拽结束时不会出class=habitlist节点的底部边界
        top = rect.height - 60
      } else if (top < 0) {
        // 顶部边界控制：控制克隆项拖拽结束时不会出class=habitlist节点的顶部边界
        top = 0
      }
      this.setData({
        top: top,
      })
      var target = parseInt(top / 60)
      var list = []  //用于备份数据
      if (this.data.startTop > top) {
        //  往上方位置拖拽
        for (var k = 0; k <= i - target; k++) {
          //  备份插入位置target开始的下方数据，除了拖拽数据项
          if (habitList[target + k]._id != kelong._id) {
            list.push(habitList[target + k])
          }
        }
        console.log("往上拖拽 list=======", list);
        if (list.lenghth != 0) {
          let lastOrder = kelong.order;
          kelong.order = habitList[target].order;
          this.calEffDataOrder(kelong);
          habitList[target] = Object.assign({},kelong);
          for (var m = target + 1, n = 0; n < list.length; m++, n++) {
            habitList[m] = Object.assign({}, list[n]);
            habitList[m].order = n < list.length -1 ? list[n+1].order : lastOrder;
            this.calEffDataOrder(habitList[m]);
          }
        }


      } else {
        // 往下边位置拖拽
        for (var k = 1; k <= target - i; k++) {
          //  备份插入位置target开始的上方数据，除了拖拽数据项
          if (habitList[i + k]._id != kelong._id) {
            list.push(habitList[i + k])
          }
        }
        console.log("往下拖拽 list=======", list);
        if (list.length != 0) {
          let lastOrder = kelong.order;
          kelong.order = habitList[target].order;
          this.calEffDataOrder(kelong);
          habitList[target] = Object.assign({},kelong);
          for (var m = i, n = 0; n < list.length; m++, n++) {
            habitList[m] = Object.assign({},list[n]);
            habitList[m].order = lastOrder;
            this.calEffDataOrder(habitList[m]);
            lastOrder = list[n].order;
          }
        }
      }
      console.log(habitList);
  
      this.setData({
        habitList: habitList,
        selectedIndex:-1,
        showkelong: false
      })

      console.log(this.data.effListMap);
    }).exec();
  },
  calEffDataOrder(data){
    var temp =  this.data.effListMap;
    temp.set(data._id,data.order);
    this.setData({
      effListMap: temp
    })
  }
})