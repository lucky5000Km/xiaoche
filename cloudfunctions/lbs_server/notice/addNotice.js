const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  let {message} = event;
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  return await db.collection('notice').add({
   
    data: {
      openid:wxContext.OPENID,
      message: message,
      _createTime: new Date().getTime(),
      _updateTime: new Date().getTime()
    }
  })
};
