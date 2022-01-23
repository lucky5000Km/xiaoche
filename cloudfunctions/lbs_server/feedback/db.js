const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.addFeedback = async(event,context)=>{
  const wxContext = cloud.getWXContext();
  let {message} = event;
  return await db.collection('feedback').add({
    data: {
      openid:wxContext.OPENID,
      message: message,
      _createTime: new Date().getTime(),
      _updateTime: new Date().getTime()
    }
  })
}