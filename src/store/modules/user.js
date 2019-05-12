import Vue from 'vue'

const user = {
  state: {
    token: '',
    self: {},
    role: {},
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      console.log(token)
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLE: (state, role) => {
      state.role = role
    },
    SET_SELF: (state, self) => {
      state.self = self
      console.log(self)
    }
  },

  actions: {
    // 登录
    Login ({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.login, userInfo, null,
          respData => {
            commit('SET_TOKEN', respData.data.token)
            commit('SET_NAME', respData.data.userName)
            commit('SET_AVATAR', respData.data.name)
            resolve(respData)
          }, errData => {
            reject(errData)
          })
      })
    },
    // 获取用户信息
    GetUserInfo ({commit}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.getUserInfo, null, null,
          respData => {
            let self = respData.data
            switch (respData.data.roleId) {
              case 1:
                self.roleType = '超级管理员'
                break
              case 2:
                self.roleType = '地方管理员'
                break
              case 3:
                self.roleType = '商业渠道'
                break
              case 4:
                self.roleType = '药厂主管'
                break
              case 5:
                self.roleType = '销售代表'
                break
              case 6:
                self.roleType = '促销员'
                break
            }
            commit('SET_SELF', respData.data)
            resolve(respData.data)
          }, err => {
            reject(err)
          })
      })
    },

    GetRoleInfo ({commit}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.getRoleInfo, null, null,
          respData => {
            commit('SET_ROLE', respData.data)
            resolve(respData.data)
          }, err => {
            reject(err)
          })
      })
    },
    UpdateUserInfo ({commit}, userInfo) {
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.updateUserInfo, null, userInfo,
          respData => {
            console.log(respData.data)
            resolve(respData.data)
          }, err => {
            reject(err)
          })
      })
    },
    SsoLogin ({commit}, token) {
      const ssoToken = {
        token: token,
        noLoading: true
      }
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.ssoLogin, ssoToken, null,
          respData => {
            commit('SET_NAME', respData.data.userName)
            commit('SET_AVATAR', respData.data.name)
            if (respData.data.token) {
              commit('SET_TOKEN', respData.data.token)
              resolve(respData)
            } else {
              reject(respData.data.token)
            }
          }, errData => {
            reject(errData)
          })
      })
    },

    // 登出
    LogOff ({commit}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.logoff, null, null,
          respData => {
            commit('SET_TOKEN', '')
            commit('SET_NAME', '')
            commit('SET_AVATAR', '')
            commit('SET_SELF', {})
            commit('SET_ROLE', {})
            resolve(respData)
          }, errData => {
            reject(errData)
          })
      })
    },

    // 前端 登出
    FedLogOut ({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        resolve()
      })
    }
  }
}

export default user
