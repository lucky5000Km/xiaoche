App({
  flag: false,
  async onLaunch (e) {


    this.initcloud()
  },
  /**
   * 初始化云开发环境（支持环境共享和正常两种模式）
   */
  async initcloud () {
    const shareinfo = wx.getExtConfigSync() // 检查 ext 配置文件
    const normalinfo = require('./envList.js').envList || [] // 读取 envlist 文件
    if (shareinfo.envid != null) { // 如果 ext 配置文件存在，环境共享模式
      this.c1 = new wx.cloud.Cloud({ // 声明 cloud 实例
        resourceAppid: shareinfo.appid,
        resourceEnv: shareinfo.envid
      })
      // 装载云函数操作对象返回方法
      this.cloud = async function () {
        if (this.flag != true) { // 如果第一次使用返回方法，还没初始化
          await this.c1.init() // 初始化一下
          this.flag = true // 设置为已经初始化
        }
        return this.c1 // 返回 cloud 对象
      }
    } else { // 如果 ext 配置文件存在，正常云开发模式
      if (normalinfo.length != 0 && normalinfo[0].envId != null) { // 如果文件中 envlist 存在
        wx.cloud.init({ // 初始化云开发环境
          traceUser: true,
          env: normalinfo[0].envId
        })
        // 装载云函数操作对象返回方法
        this.cloud = () => {
          return wx.cloud // 直接返回 wx.cloud
        }
      } else { // 如果文件中 envlist 存在，提示要配置环境
        this.cloud = () => {
          throw '当前小程序没有配置云开发环境，请在 envList.js 中配置你的云开发环境'
        }
      }
    }

            
      //初始化站点
      wx.cloud.callFunction({
        name: 'lbs_server',
        data: {
          type: 'configs'
        }
        }).then((resp) => {       
          console.log('获取配置信息'+JSON.stringify(resp))
          resp.result.data.forEach(element => {
            wx.setStorage({
              key:element.key,
              data: element
            })
          });
      }).catch((e) => {
          console.log(e);
      });

  },
  /**
   * 封装的云函数调用方法
   * @param {*} obj 传入对象
   */
  async call (obj) {
    return new Promise(async (resolve, reject) => {
      try {
        const cloud = await this.cloud()
        if (obj.load !== false) { // 如果load不为false
          wx.showLoading({ // 展示加载load
            title: obj.tips || '加载中', // 如果没有tips，默认加载中
            mask: true
          })
        }
        const res = await cloud.callFunction({ // 发起云函数请求
          name: 'lbs_server', // 应用统一服务函数
          data: {
            type: obj.name, // 服务类型
            data: obj.data // 服务数据
          }
        })
        console.log('【云函数调用成功】', res)
        wx.hideLoading() // 取消加载
        if (res.result.code === 0) { // 如果返回code为0，则业务正常
          resolve(res.result)
        } else { // 如果返回code不为0，则证明有点问题
          let tips = res.result.msg || '服务调用出现未知问题，请重新尝试！' // 提示文字如果没回传，默认提示
          if (tips === '查询无结果') { // 如果提示文字为这个，不说人话
            tips = '没有找到地址，请在地址中填写城市名，并尽可能详细' // 改为说人话
          }
          wx.showModal({ // 弹出提示框
            content: tips + '，请阅读项目目录readme.md文件，根据步骤设置',
            showCancel: false
          })
        }
      } catch (e) { // 网络问题出现
        let flag = e.toString()
        flag = flag.indexOf('FunctionName') === -1 ? flag : '请在cloudfunctions文件夹中lbs_server上右键，创建部署云端安装依赖，然后再次体验'
        console.error('【云函数调用失败】', flag)
        wx.hideLoading()
        wx.showModal({
          content: flag, // 此提示可以在正式时改为 "网络服务异常，请确认网络重新尝试！"
          showCancel: false
        })
      }
    })
  }
})
