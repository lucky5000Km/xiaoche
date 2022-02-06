const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
const MAX_LIMIT = 100
const _ = db.command
exports.main = async (event, context) => {
  const openTimeConfig = await db.collection('configs').where({
    key: 'open_time'
  }).get();
  console.log("openTimeConfig==",openTimeConfig);
  let beginTime;
  let endTime;
  if(openTimeConfig === undefined || openTimeConfig === null || openTimeConfig.data.length < 1 || openTimeConfig.data[0].length <1){
    return;
  }
  var date = new Date()
  var items = openTimeConfig.data[0].value;
  var now = new Date().getTime()
  let canQuery = false;
  for(var e in items){
    var begin = items[e].begin.split(':')
    beginTime = date.setHours(begin[0],begin[1],0);
    var end = items[e].end.split(':')
    endTime = date.setHours(end[0],end[1],0);
    if(now >= beginTime && now <= endTime){
      canQuery = true;
      break;
    } 
  }
  console.log("beginTime",beginTime);
  console.log("endTime",endTime);
  if(!canQuery){
    return;
  }
  // 先取出集合记录总数
  const countResult = await db.collection('location_log').where({
    create_time:_.gt(beginTime),
    create_time:_.lt(endTime)
  }).count()
  const total = countResult.total
  console.log('count location_log %s',total)
  if(total < 1){
    return;
  }
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('location_log').where({
      create_time:_.gt(beginTime),
      create_time:_.lt(endTime)
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}