import axios from 'axios'
import {Message, Loading} from 'element-ui'
import store from '@/store'
let loadingInstance
axios.interceptors.request.use(config => {
  console.debug('[' + config.method + ']' + config.url + '->' + JSON.stringify(config.params, null, ' '))
  loadingInstance = Loading.service({
    text: '请稍等',
    target: document.querySelector('.loadingtext')
  })
  if (store.state.token) {
    config.headers.common['x-access-token'] = store.state.token
  }
  return config
}, err => {
  Message.error({message: '请求超时!'})
  return Promise.resolve(err)
})
axios.interceptors.response.use(resp => {
  console.debug('[' + resp.config.method + ']' + resp.config.url + '->' + JSON.stringify(resp.data, null, ' '))
  loadingInstance.close()
  if (resp.status && resp.status === 200 && resp.data.status === 'error') {
    Message.error({message: resp.data.data})
    return
  }
  return resp
}, err => {
  if (err.response.status === 504 || err.response.status === 404) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'})
  } else if (err.response.status === 403) {
    Message.error({message: '权限不足,请联系管理员!'})
  } else {
    Message.error({message: '未知错误!'})
  }
  return Promise.resolve(err)
})

axios.defaults.baseURL = 'https://api.tanyakeji.com'
let base = ''

export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const uploadFileRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const deleteRequest = (url) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`
  })
}
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params
  })
}
