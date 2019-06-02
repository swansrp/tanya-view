import Vue from 'vue'

Vue.prototype.serviceType = {
  role: '/role', // 角色相关
  history: '/campaign/history', // 促销仅占相关
  campaign: '/campaign', // 促销活动相关
  notify: '/notify', // 公告相关
  goods: '/goods', // 药品相关
  shop: '/shop', // 药店相关
  discount: '/discount', // 折扣相关
  order: '/order' // 订单相关
}

Vue.prototype.apiType = {
  getDiscount: {url: Vue.prototype.serviceType.discount + '/query', method: 'POST'},
  getOrder: {url: Vue.prototype.serviceType.order + '/query', method: 'POST'},
  confirmDiscount: {url: Vue.prototype.serviceType.discount + '/confirm', method: 'GET'},
  confirmOrder: {url: Vue.prototype.serviceType.order + '/confirm', method: 'GET'},
  getToken: {url: '/token', method: 'GET'},
  login: {url: '/login', method: 'GET'}, // 登录
  ssoLogin: {url: '/sso', method: 'GET'}, // SSO 登录
  logoff: {url: '/logoff', method: 'GET'}, // 登出
  getMenu: {url: '/menu/query', method: 'GET'}, // 获取用户权限树
  getUserInfo: {url: '/info', method: 'GET'}, // 获取用户信息
  updateUserInfo: {url: '/info', method: 'POST'}, // 更新用户信息
  getRoleInfo: {url: Vue.prototype.serviceType.role + '/self', method: 'GET'}, // 获取本人职位信息
  updateRole: {url: Vue.prototype.serviceType.role + '/update', method: 'POST'}, // 更新角色信息
  querySubordinate: {url: Vue.prototype.serviceType.role + '/subordinate', method: 'GET'}, // 获取下属
  getCaptcha: {url: '/captcha.jpg', method: 'GET'}, // 获取验证码
  queryShop: {url: Vue.prototype.serviceType.shop + '/query', method: 'POST'}, // 获取客户(药店)
  updateShop: {url: Vue.prototype.serviceType.shop + '/update', method: 'POST'}, // 更新客户(药店)
  deleteShop: {url: Vue.prototype.serviceType.shop + '/', method: 'DELETE'}, // 删除客户(药店)
  getShopTemplate: {url: Vue.prototype.serviceType.shop + '/template', method: 'GET', fileName: '客户(药店)模板.xls'}, // 获取客户(药店)模板
  uploadShop: {url: Vue.prototype.serviceType.shop + '/upload', method: 'POST'}, // 上传客户(药店)列表
  queryGoods: {url: Vue.prototype.serviceType.goods + '/query', method: 'POST'}, // 获取商品(药品)
  queryBindGoods: {url: Vue.prototype.serviceType.goods + '/bind', method: 'GET'}, // 获取商品(药品)绑定情况
  updateGoods: {url: Vue.prototype.serviceType.goods + '/update', method: 'POST'}, // 更新商品(药品)
  deleteGoods: {url: Vue.prototype.serviceType.goods + '/', method: 'DELETE'}, // 删除商品(药品)
  getGoodsTemplate: {url: Vue.prototype.serviceType.goods + '/template', method: 'GET', fileName: '商品(药品)模板.xls'}, // 获取商品(药品)模板
  uploadGoods: {url: Vue.prototype.serviceType.goods + '/upload', method: 'POST'}, // 上传商品(药品)列表
  bindGoods: {url: Vue.prototype.serviceType.goods + '/bind', method: 'POST'} // 绑定商品(药品)列表
}

export default {}
