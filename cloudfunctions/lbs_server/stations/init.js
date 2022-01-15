const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command
// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const stations = [
    {
      id: 0,
      "name":"未来领袖幼儿园",
      "latitude":40.064154,
      "longitude":116.365527,
      "line":"南线",
      "detail":{
        "back":{
          "order":0,
          "time":"16:40",
          "tag":"南线"
        }
      }
    },
    {
      id: 1,
      "name":"永泰庄38号院",
      "latitude":40.036886,
      "longitude":116.354714,
      "detail":{
        "go":{
          "order":1,
          "time":"07:10",
        },
        "back":{
          "order":11,
          "time":"17:33",
        }
      }
    },
    {
      id: 2,
      "name":"永泰东里",
      "latitude":40.034065,
      "longitude":116.356123,
      "detail":{
        "go":{
          "order":2,
          "time":"07:13",
        },
        "back":{
          "order":9,
          "time":"17:25",
        }
      }
    },
    {
      id: 3,
      "name":"宝盛北里",
      "latitude":40.039959,
      "longitude":116.367922,
      "detail":{
        "go":{
          "order":1,
          "time":"07:15",
        },
        "back":{
          "order":6,
          "time":"17:12",
        }
      }
    },
    {
      id: 4,
      "name":"芳清园",
      "latitude":40.03314,
      "longitude":116.372243,
      "detail":{
        "go":{
          "order":4,
          "time":"07:20",
        },
        "back":{
          "order":7,
          "time":"17:17",
        }
      }
    },
    {
      id: 5,
      "name":"森林大第",
      "latitude":40.062439,
      "longitude":116.384272,
      "detail":{
        "go":{
          "order":5,
          "time":"07:30",
        },
        "back":{
          "order":5,
          "time":"17:02",
        }
      }
    },
    {
      id: 6,
      "name":"富力桃园",
      "latitude":40.061957,
      "longitude":116.378426,
      "detail":{
        "go":{
          "order":6,
          "time":"07:32",
        },
        "back":{
          "order":4,
          "time":"17:00",
        }
      }
    },
    {
      id: 7,
      "name":"国风美唐三期",
      "latitude":40.077235,
      "longitude":116.36378,
      "detail":{
        "go":{
          "order":7,
          "time":"07:45",
        },
        "back":{
          "order":1,
          "time":"16:45",
        }
      }
    },
    {
      id: 8,
      "name":"国风美唐二期",
      "latitude":40.079965,
      "longitude":116.363462,
      "detail":{
        "go":{
          "order":8,
          "time":"07:47",
        },
        "back":{
          "order":2,
          "time":"16:47",
        }
      }
    },
    {
      id: 9,
      "name":"动街区",
      "latitude":40.06247,
      "longitude":116.358503,
      "detail":{
        "go":{
          "order":9,
          "time":"07:55",
        },
        "back":{
          "order":3,
          "time":"16:55",
        }
      }
    },
    {
      id: 10,
      "name":"永泰庄20号院",
      "latitude":40.037839,
      "longitude":116.359531,
      "detail":{
        "back":{
          "order":10,
          "time":"17:28",
        }
      }
    },
    {
      id: 11,
      "name":"莱圳家园",
      "latitude":40.047368,
      "longitude":116.34502,
      "detail":{
        "back":{
          "order":12,
          "time":"17:40",
        }
      }
    },
    {
      id: 12,
      "name":"金域华府",
      "latitude":40.066044,
      "longitude":116.309865,
      "detail":{
        "back":{
          "order":13,
          "time":"17:55",
        }
      }
    }
  ]


  try {
    var remove = false;
    var add = false;
    if(remove){
      db.collection('stations').where({id: _.gt(-1)}).remove({
        success: function(res) {
          console.log('remove data '+reres.data)
        }
      })
    }
   if(add){
    stations.forEach(item => db.collection('stations').add({data:item}) )
   }
   
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
