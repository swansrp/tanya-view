// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Element from 'element-ui'
import VueQr from 'vue-qr'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
// 图标
import './static/icon/icons/index.js'
import Icon from './static/icon/components/Icon'
import '@/assets/iconfont/iconfont'
import Vueawesome from 'vue-awesome'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 全局状态
import common from '@/utils/common'
import fetch from '@/utils/fetch'
import apiType from '@/utils/apiType'
// import permission from '@/store/modules/permission'

Vue.config.productionTip = false
Vue.component('icon', Icon)
Vue.use(Element, {
  size: 'medium'
})
Vue.use(Vueawesome)
Vue.use(VueQr)

router.beforeEach((to, from, next) => {
  console.log('路由变化:' + from.name + ' -> ' + to.name)
  NProgress.start()
  const name = Vue.prototype.getSessionStorage('name')

  if (name) {
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done() // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    } else if (to.path === '/') {
      next()
    } else {
      if (store.getters.addRouters.length > 0) { // 判断当前用户是否已拉取完user_info信息
        next()
      } else {
        console.log('获取权限树')
        store.dispatch('GenerateRoutes').then(() => {
          router.addRoutes(store.getters.addRouters)
          next({...to}) // hack方法 确保addRoutes已完成
        })
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      console.log('没有登录')
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App, common, fetch, apiType},
  template: '<App/>'
})
