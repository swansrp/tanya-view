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
  getToken: {url: '/token', method: 'GET'},
  login: {url: '/login', method: 'GET'}, // 登录
  logoff: {url: '/logoff', method: 'GET'}, // 登出
  getMenu: {url: '/menu/query', method: 'GET'}, // 获取用户权限树
  getUserInfo: {url: '/info', method: 'GET'}, // 获取用户信息
  getRoleInfo: {url: Vue.prototype.serviceType.role + '/self', method: 'GET'}, // 获取本人职位信息
  querySubordinate: {url: Vue.prototype.serviceType.role + '/subordinate', method: 'GET'}, // 获取下属
  getCaptcha: {url: '/captcha.jpg', method: 'GET'} // 获取验证码
}

export default {}
