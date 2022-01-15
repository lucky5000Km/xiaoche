const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
const MAX_LIMIT = 100
const _ = db.command
const beginTime = new Date(2022,01,05,16,30)
const endTime = new Date(2022,01,05,18,30)
exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('location_log').where({
    create_time:_.gt(beginTime),
    create_time:_.lt(endTime)
  }).count()
  const total = countResult.total
  console.log('count location_log %s',total)
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