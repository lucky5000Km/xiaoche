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
  var goTap = event.goTap;
  console.log(event);
  if(effListMap === null || effListMap === undefined|| effListMap.size <= 0){
    return;
  }
  var keys = effListMap.keys();
  for(const key of keys){
    console.log(key,effListMap.get(key),goTap);
    update(key,effListMap.get(key),goTap);
  }
}
