module.exports.getUserType = async () =>{
  var userInfo = await wx.getStorage({
    key:"token"
  });
  if(userInfo === undefined){
    return undefined;
  }
  console.log(userInfo,"getUserInfo===")
  return userInfo.data.type;
}