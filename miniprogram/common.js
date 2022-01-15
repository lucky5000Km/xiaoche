module.exports.getUserType = async () =>{
  var userInfo = await wx.getStorage({
    key:"token",
    encrypt:true
  });
  if(userInfo === undefined){
    return undefined;
  }
  console.log(userInfo,"getUserInfo===")
  return userInfo.data.type;
}
module.exports.getLastedNotice = async ()=>{
 var noticeInfo = await  wx.cloud.callFunction({
    name: 'lbs_server',
    data: {
      type: 'getLastedNotice'
    }
    });
  if(noticeInfo.result !== undefined && noticeInfo.result.data.length > 0){
    return noticeInfo.result.data[0].message;
  }
  return '暂无';
}

module.exports.callCouldFun = async(methodName,data) =>{
  if(data === undefined || data === null){
    data === {};
  }
  data.type = methodName;
  return await wx.cloud.callFunction({
    name: 'lbs_server',
    data: data
  })
}