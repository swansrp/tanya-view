import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import {Loading, Message, Notification} from 'element-ui'
import store from '@/store'

let loadingInstance
let param
let body
axios.interceptors.request.use(config => {
  param = transferUrl(config.params)
  body = config.data
  console.debug('-> [' + config.method + ']' + config.url +
    (param == null ? '' : ('?' + param)) +
    (body == null ? '' : ('\n->' + JSON.stringify(config.data, null, ' '))))
  let loading = true
  if (config.params != null) {
    if (config.params.noLoading === true) {
      loading = false
    }
  }
  if (loading) {
    loadingInstance = Loading.service({
      text: '请稍等',
      target: document.querySelector('.loadingtext')
    })
  }
  if (store.getters.token) {
    config.headers.common['x-access-token'] = store.getters.token
  } else {
    config.headers.common['x-access-token'] = Vue.prototype.getSessionStorage('auth_token')
  }
  return config
}, err => {
  if (loadingInstance) {
    loadingInstance.close()
  }
  Message.error({message: '请求超时!'})
  return Promise.resolve(err)
})
axios.interceptors.response.use(resp => {
  console.debug('<- [' + resp.config.method + ']' + resp.config.url + '->' + JSON.stringify(resp.data, null, ' '))
  if (loadingInstance) {
    loadingInstance.close()
  }
  if (resp.data.code === 'SRP0004') {
    window.sessionStorage.removeItem('token')
    router.push({path: '/login'})
    return Promise.reject(resp)
  }
  return Promise.resolve(resp)
}, err => {
  console.debug('-_- [' + err.config.method + ']' + err.config.url + '->' + JSON.stringify(err.response.data, null, ' '))
  if (loadingInstance) {
    loadingInstance.close()
  }
  if (err.response.status === 504 || err.response.status === 404) {
    Message.error({message: '服务器被吃了⊙﹏⊙∥'})
  } else if (err.response.status === 403) {
    Message.error({message: '权限不足,请联系管理员!'})
  } else if (err.response.status === 500) {
    if (err.response.data.code === 'SRP0002') {
      Message.error({message: err.response.data.data})
    } else {
      Notification.error({message: err.response.data.data})
    }
  } else {
    Message.error({message: '未知错误'})
  }
  return Promise.reject(err.response)
})

axios.defaults.baseURL = Vue.prototype.baseUrl
let base = ''

Vue.prototype.fetch = function fetch (apiType, params, body, cbfunc, errorfunc) {
  // axios.defaults.baseURL = Vue.prototype.baseUrl
  axios({
    method: apiType.method,
    url: `${base}${apiType.url}`,
    data: body,
    params: params,
    /*
    transformRequest: [function (params) {
      if (apiType.method === 'GET') {
        return
      }
      return transferUrl(params)
    }],
    */
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(resp => {
    if (cbfunc) {
      cbfunc(resp.data)
    }
  }, err => {
    if (errorfunc) {
      errorfunc(err.data)
    }
  })
}
Vue.prototype.download = function (apiType, params, body, cbfunc, errorfunc) {
  axios({
    method: apiType.method,
    url: `${base}${apiType.url}`,
    data: body,
    params: params,
    // headers: {'Access-Control-Expose-Headers': 'Content-disposition'},
    responseType: 'blob'
  }).then(resp => {
    download(resp, apiType.fileName)
    if (cbfunc) {
      cbfunc(resp.data)
    }
  }, err => {
    if (errorfunc) {
      errorfunc(err.data)
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
    if (cbfunc) {
      cbfunc(resp)
    }
  }, err => {
    if (errorfunc) {
      errorfunc(err)
    }
  })
}

function transferUrl (params) {
  if (!params) {
    return null
  }
  let param = Object.entries(params)
  let ret = ''
  for (let k in param) {
    ret += param[k][0] + '=' + encodeURIComponent(param[k][1]) + '&'
  }
  return ret.substring(0, ret.length - 1)
}

function download (res, fileName) {
  const content = res.data
  // 构造一个blob对象来处理数据
  const blob = new Blob([content])

  // 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
  // IE10以上支持blob但是依然不支持download
  if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
    const link = document.createElement('a')// 创建a标签
    link.download = fileName// a 标签添加属性
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click()// 执行下载
    URL.revokeObjectURL(link.href) // 释放url
    document.body.removeChild(link)// 释放标签
  } else { // 其他浏览器
    navigator.msSaveBlob(blob, fileName)
  }
}

export default fetch
