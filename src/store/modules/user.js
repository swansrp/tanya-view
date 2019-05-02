import Vue from 'vue'

const user = {
  state: {
    token: '',
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
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
            resolve(respData)
          }, errData => {
            reject(errData)
          })
      })
    },
    /*
    // 获取用户信息
    GetInfo ({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
*/
    // 登出
    LogOff ({ commit, state }) {
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.logoff, null, null,
          respData => {
            commit('SET_TOKEN', '')
            commit('SET_NAME', '')
            resolve(respData)
          }, errData => {
            reject(errData)
          })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        resolve()
      })
    }
  }
}

export default user
