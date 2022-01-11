const work = require('./work') // 引入work文件模块
const stations = require('./stations/index');
const stationsAdd = require('./stations/init');
const stationsUpdate = require('./stations/update');
const locations = require('./locations/index');
const syncLocation = require('./locations/sync');
const polyline = require('./locations/polyline');

const validGroup = require('./group/index');
const getGroupId = require('./group/getid');
const user = require('./user/index');
const getOpenId = require('./user/getOpenId');
const getUser = require('./user/getUser');
const addUser = require('./user/addUser');

const configs = require('./configs/index');

const getLastedNotice = require('./notice/getLastedNotice');
const addNotice = require('./notice/addNotice');


exports.main = async (event, context) => {
  if (event.type === 'address') { // 文字地址到经纬度转换
    return await work.address(event.data)
  } else if (event.type === 'location') { // 经纬度到文字地址的转换
    return await work.location(event.data)
  } else if (event.type === 'stations'){
    return await stations.main(event,context);
  }else if (event.type === 'stationsAdd'){
    return await stationsAdd.main(event,context);
  }else if (event.type === 'locations'){
    return await locations.main(event,context);
  }else if (event.type === 'syncLocation'){
    return await syncLocation.main(event,context);
  }else if (event.type === 'validGroup'){
    return await validGroup.main(event,context);
  }else if (event.type === 'getGroupId'){
    return await getGroupId.main(event,context);
  }else if (event.type === 'user'){
    return await user.main(event,context);
  }else if (event.type === 'stationsUpdate'){
    return await stationsUpdate.main(event,context);
  }else if (event.type === 'configs'){
    return await configs.main(event,context);
  }else if (event.type === 'getOpenId'){
    return await getOpenId.main(event,context);
  }else if (event.type === 'getUser'){
    return await getUser.main(event,context);
  }else if (event.type === 'addUser'){
    return await addUser.main(event,context);
  }else if (event.type === 'polyline'){
    return await polyline.main(event,context);
  }else if(event.type === 'getLastedNotice'){
    return await getLastedNotice.main(event,context);
  }else if(event.type === 'addNotice'){
    return await addNotice.main(event,context);
  }
  else {
    return {
      code: -1
    }
  }
}
