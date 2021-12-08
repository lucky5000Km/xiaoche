const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
   await db.collection('locations').doc('fa4fe87261a35d3a0090ee0e1b4e9342').update({
    data: {
      lat: event.lat,
      lon: event.lon,
      update_time: new Date()
    }
  });
  return true
};
