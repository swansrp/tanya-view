// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import {getRequest, postRequest, deleteRequest, putRequest} from '@/api/api'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest

router.beforeEach((to, from, next) => {
  console.log('路由变化:' + from.name + ' -> ' + to.name)
  if (to.name === 'Login') {
    next()
  } else {
    let token = store.state.token.toString()
    if (token === '') {
      console.log('token 丢失 重新登录')
      next({path: '/', query: {redirect: to.path}})
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
