const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  return await db.collection('stations').doc(event._id).update({
    data:{
      longitude: event.longitude,
      latitude: event.latitude
    }
  });
};
async function update(_id,order,goTab) {
  var updateDate ={};
  if(goTab){
    updateDate = {
      go:{
        order:order
      } 
    }
  }else{
    updateDate = {
      back: {
        order: order
      }
    }
  }
  await db.collection('stations').doc(_id).update({
    data:{
      detail:updateDate
    }
  })
}
module.exports.updateOrder = (event,context) =>{
  var effListMap = event.effListMap;
  effListMap = new Map(Object.entries(effListMap));
  var goTab = event.goTab;
  console.log(event);
  if(effListMap === null || effListMap === undefined|| effListMap.size <= 0){
    return;
  }
  var keys = effListMap.keys();
  for(const key of keys){
    console.log(key,effListMap.get(key),goTab);
    update(key,effListMap.get(key),goTab);
  }
}

exports.updateOrInsertStation = async (event,context)=>{
  const wxContext = cloud.getWXContext();
  console.log(event);
  var insert = false;
  var goTab = event.goTab;
  if(event._id === undefined || event._id === null || event._id === -1){
    insert = true;
  }
  if(goTab === undefined || goTab === null){
    return;
  }
  var dataSave = {
    latitude: event.latitude,
    longitude: event.longitude,
    name: event.name,
    open_id: wxContext.OPENID,
    _updateTime : new Date().getTime()
  }
  console.log(dataSave);
  var timeAndOrder = {};
  if(insert){
    timeAndOrder.order = event.order;
  }
  timeAndOrder.time = event.time;
  if(goTab){
    dataSave.detail = {
      go:timeAndOrder
    }
  }else{
    dataSave.detail = {
      back:timeAndOrder
    }
  }
  if(insert){
    dataSave._createTime = new Date().getTime()
    return await db.collection("stations").add({
      data: dataSave
    })
  }else{
    return await db.collection("stations").doc(event._id).update({
      data:dataSave
    })
  }
}
