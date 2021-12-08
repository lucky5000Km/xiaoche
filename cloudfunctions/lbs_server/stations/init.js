const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const stations = [
    {
      id: 0,
      "name":"未来领袖幼儿园",
      "station_index":0,
      "tag":"0100",
      "departure_time":"7:00",
      "direction":"DEPART",
      "latitude":40.064154,
      "longitude":116.365527,
      "line":"南线"
    },
    {
      id: 1,
      "name":"永泰庄38号院",
      "station_index":1.0,
      "tag":"0100",
      "departure_time":"7:10",
      "direction":"DEPART",
      "latitude":40.036886,
      "longitude":116.354714,
      "line":"南线"
    },
    {
      id: 2,
      "name":"永泰东里",
      "station_index":2,
      "tag":"0100",
      "departure_time":"7:13",
      "direction":"DEPART",
      "latitude":40.034065,
      "longitude":116.356123,
      "line":"南线"
    },
    {
      id: 3,
      "name":"宝盛北里",
      "station_index":3,
      "tag":"0100",
      "departure_time":"7:15",
      "direction":"DEPART",
      "latitude":40.039959,
      "longitude":116.367922,
      "line":"南线"
    },
    {
      id: 4,
      "name":"芳清园",
      "station_index":4,
      "tag":"0100",
      "departure_time":"7:20",
      "direction":"DEPART",
      "latitude":40.03314,
      "longitude":116.372243,
      "line":"南线"
    },
    {
      id: 5,
      "name":"森林大第",
      "station_index":5,
      "tag":"0100",
      "departure_time":"7:30",
      "direction":"DEPART",
      "latitude":40.062439,
      "longitude":116.384272,
      "line":"南线"
    },
    {
      id: 6,
      "name":"富力桃园",
      "station_index":6,
      "tag":"0100",
      "departure_time":"7:32",
      "direction":"DEPART",
      "latitude":40.061957,
      "longitude":116.378426,
      "line":"南线"
    },
    {
      id: 7,
      "name":"国风美唐三期",
      "station_index": 7,
      "tag":"0100",
      "departure_time":"7:45",
      "direction":"DEPART",
      "latitude":40.077235,
      "longitude":116.36378,
      "line":"北线"
    },
    {
      id: 8,
      "name":"国风美唐二期",
      "station_index": 8,
      "tag":"0100",
      "departure_time":"7:47",
      "direction":"DEPART",
      "latitude":40.079965,
      "longitude":116.363462,
      "line":"北线"
    },
    {
      id: 9,
      "name":"动街区",
      "station_index":9,
      "tag":"0100",
      "departure_time":"7:55",
      "direction":"DEPART",
      "latitude":40.06247,
      "longitude":116.358503,
      "line":"北线"
    }
  ]


  try {
    //stations.forEach(item => db.collection('stations').add({data:item}) )
   
    return {
      success: true
    };
  } catch (e) {
    // 这里catch到的是该collection已经存在，从业务逻辑上来说是运行成功的，所以catch返回success给前端，避免工具在前端抛出异常
    return {
      success: true,
      data: 'create collection success'
    };
  }
};
