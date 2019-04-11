import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: {
      name: '',
      username: '',
      role: ''
    },
    menu: []
  },
  mutations: {
    initMenu (state, menus) {
      state.menu = menus
      console.log('获取权限树： ' + menus)
    },
    initUserInfo (state, userInfo) {
      state.user.name = userInfo.name
      state.user.role = userInfo.roleId
      console.log('获取用户基本信息: ' + JSON.stringify(userInfo))
    },
    login (state, user) {
      state.token = user.token
      state.user.username = user.name
      console.log('登录存储token: ' + state.token)
    },
    logout (state) {
      state.menu = []
      state.token = ''
      state.user.username = ''
      state.user.role = ''
      console.log('等出清除token: ' + state.token)
    }
  }
})
