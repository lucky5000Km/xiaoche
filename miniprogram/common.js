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

async function callCouldFun(methodName,data ) {
  console.log(methodName,data,"+++++");
  if(data === undefined || data === null){
    data = {};
  }
  data.type = methodName;
  return await wx.cloud.callFunction({
    name: 'lbs_server',
    data: data
  })
}

module.exports.callCouldFun = callCouldFun;

module.exports.getStationsList = async () =>{
  try{
    var result = await callCouldFun("stations",null);
    console.log(result);
    result = result.result;
    if(result!== null && result.data!== undefined && result.data !== null){
      return result.data;
    }
    return null;
  }catch(err){
    console.log(err);
  }
}

module.exports.getGoTable = (data)=>{
  if(data === undefined || data === null || data.length <= 0){
    return [];
  }
  let goStations = data.filter(function(item){
    return item.detail.go !== undefined
  }).sort(function(a,b){
    return a.detail.go.order - b.detail.go.order
  }).map(function(item){
    return {
      "name":item.name,
      "departure_time":item.detail.go.time,
      "_id":item._id,
      "latitude":item.latitude,
      "longitude":item.longitude,
      "order": item.detail.go.order
    }
  })
  return goStations;
}

module.exports.getBackTable = (data) =>{
  if(data === undefined || data === null || data.length <= 0){
    return [];
  }
  let backStations = data.filter(function(item){
    return item.detail.back !== undefined
  }).sort(function(a,b){
    return a.detail.back.order - b.detail.back.order
  }).map(function(item){
    return {
    "name":item.name,
    "departure_time":item.detail.back.time,
    "_id":item._id,
    "latitude":item.latitude,
    "longitude":item.longitude,
    "order": item.detail.back.order
    }
  })
  return backStations;
}

module.exports.toEditStationsPage = (item) =>{
  var params = '?_id='+item._id+"&name="+item.name+'&departure_time='+item.departure_time+'&latitude='+item.latitude+'&longitude='+item.longitude;
  wx.navigateTo({
    url: '../stationinfo/stationinfo'+params,
  })
}