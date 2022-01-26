const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

exports.main = async (event, context) => {
  userList = await db.collection('user').get();
  console.log('userlist %s',JSON.stringify(userList))
  var result = {
    'ADMIN' : userList.data.filter(item => item.type === 'ADMIN'),
    'PARENT' : userList.data.filter(item => item.type === 'PARENT'),
    'DRIVER' : userList.data.filter(item => item.type === 'DRIVER'),
  }
  
  return result;
};

exports.deleteUser = async(event,context) =>{
   return await db.collection('user').doc(event.id).remove()
}

exports.updateUserStat = async(event,context) =>{
  return await db.collection('user').doc(event.id).update({
    data:{
      disable: event.disable
    }
  })
}