const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  console.log('query open id %s',wxContext.OPENID)
  return await db.collection('user').where({
    openid: wxContext.OPENID
  }).get({
    success:function(res){
      console.log('query user list %s',JSON.stringify(res))
    }
  })



  

};

