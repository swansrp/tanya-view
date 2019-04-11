import {getRequest} from '@/api/api'

export const getUserInfo = (store) => {
  if (store.state.user.name) {
    return
  }
  getRequest('/info').then(resp => {
    if (resp && resp.status === 200) {
      store.commit('initUserInfo', resp.data.data)
    }
  })
}
