const work = require('./work') // 引入work文件模块
const stations = require('./stations/index');
const stationsAdd = require('./stations/init');
const locations = require('./locations/index');
const syncLocation = require('./locations/sync');
const validGroup = require('./group/index');
const getGroupId = require('./group/getid');
const user = require('./user/index');


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
  }else {
    return {
      code: -1
    }
  }
}
