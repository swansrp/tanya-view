import Vue from 'vue'
import Cookies from 'js-cookie'

Vue.prototype.setSessionStorage = function (key, value) {
  window.sessionStorage.setItem(key, value)
}
Vue.prototype.getSessionStorage = function (key) {
  const value = window.sessionStorage.getItem(key)
  if (!value || value === '') {
    return ''
  }
  return value
}
Vue.prototype.removeSessionStorage = function (key) {
  window.sessionStorage.removeItem(key)
}
Vue.prototype.setCookie = function (key, value) {
  Cookies.set(key, value)
}
Vue.prototype.getCookie = function (key) {
  const value = Cookies.get(key)
  if (!value || value === '') {
    return ''
  }
  return value
}
Vue.prototype.removeCookie = function (key) {
  Cookies.remove(key)
}
Vue.prototype.setLocalStorage = function (key, value) {
  if (!value) {
    window.localStorage.setItem(key, '')
  } else {
    window.localStorage.setItem(key, value)
  }
}
Vue.prototype.getLocalStorage = function (key) {
  const value = window.localStorage.getItem(key)
  if (!value || value === '') {
    return ''
  }
  return value
}
Vue.prototype.checkToken = function (key) {
  const reg = /^AUTH_[0-9A-Za-z]{22}$/
  return reg.test(key)
}

Vue.prototype.baseUrl = process.env.baseUrl

export default {}
