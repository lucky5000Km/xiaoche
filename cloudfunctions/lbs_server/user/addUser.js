const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  // 获取基础信息
  const wxContext = cloud.getWXContext();
  return await db.collection('user').add({
    data: {
      openid:wxContext.OPENID,
      nickName:event.userInfo.nickName,
      avatarUrl:event.userInfo.avatarUrl,
      type: 'PARENT',
      disable:true,
      _createTime: new Date().getTime(),
      _updateTime: new Date().getTime()
    }
  })



  

};

