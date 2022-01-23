const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取openId云函数入口函数
exports.main = async (event, context) => {
  userList = await db.collection('user').get();
  console.log('userlist %s',JSON.stringify(userList))
  return userList;
};

exports.updateUserStat = async(event,context) =>{
   return await db.collection('user').doc(event.id).update({
     data:{
       disable: event.disable
     }
   })
}

