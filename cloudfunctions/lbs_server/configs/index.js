const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  console.log('event data '+JSON.stringify(event))
  return await db.collection('configs').get();
};
exports.getNotify = async (event, context) =>{
  return await db.collection('configs').where({
    key: 'notify'
  }).get();
}
exports.updateNotify = async(event, context) =>{
  return await db.collection('configs').where({
    key: 'notify'
  }).update({
    data:{
      value:{
        data: event.message
      }
    }
  })
}
