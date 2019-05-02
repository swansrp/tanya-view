import Vue from 'vue'
import axios from 'axios'
import {Loading, Message} from 'element-ui'
import store from '@/store'

let loadingInstance
axios.interceptors.request.use(config => {
  console.debug('-> [' + config.method + ']' + config.url + '->' + JSON.stringify(config.params, null, ' '))
  loadingInstance = Loading.service({
    text: '请稍等',
    target: document.querySelector('.loadingtext')
  })
  if (store.getters.token) {
    config.headers.common['x-access-token'] = store.getters.token
  } else {
    config.headers.common['x-access-token'] = Vue.prototype.getSessionStorage('auth_token')
  }
  return config
}, err => {
  loadingInstance.close()
  Message.error({message: '请求超时!'})
  return Promise.resolve(err)
})
axios.interceptors.response.use(resp => {
  console.debug('<- [' + resp.config.method + ']' + resp.config.url + '->' + JSON.stringify(resp.data, null, ' '))
  loadingInstance.close()
  return Promise.resolve(resp.data)
}, err => {
  console.debug('-_- [' + err.config.method + ']' + err.config.url + '->' + JSON.stringify(err.response.data, null, ' '))
  if (err.response.status === 504 || err.response.status === 404) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'})
  } else if (err.response.status === 403) {
    Message.error({message: '权限不足,请联系管理员!'})
  } else if (err.response.status === 500 && err.response.data.code === 'SRP0002') {
    Message.error({message: err.response.data.data})
  } else {
    Message.error({message: '未知错误'})
  }
  loadingInstance.close()
  return Promise.reject(err.response.data)
})

axios.defaults.baseURL = Vue.prototype.baseUrl
let base = ''

Vue.prototype.fetch = function fetch (apiType, params, body, cbfunc, errorfunc) {
  axios({
    method: apiType.method,
    url: `${base}${apiType.url}`,
    data: body,
    params: params,
    transformRequest: [function (data) {
      if (apiType.method === 'GET') {
        return
      }
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (cbfunc) {
      cbfunc(resp)
    }
  }, err => {
    if (errorfunc) {
      errorfunc(err)
    }
  })
}
Vue.prototype.upload = function (url, body, cbfunc, errorfunc) {
  axios({
    method: 'POST',
    url: `${base}${url}`,
    data: body,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(resp => {
    cbfunc(resp)
  }, err => {
    errorfunc(err)
  })
}

export default fetch
