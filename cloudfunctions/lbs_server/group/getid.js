const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  console.log('event data '+JSON.stringify(event))
  return await db.collection('configs').doc('381d149061b4ab2801f57d702017004c').get();;
};
