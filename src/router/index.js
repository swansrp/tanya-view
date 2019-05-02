import Vue from 'vue'
import Router from 'vue-router'

/* layout */
import Layout from '@/views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
/* demo page */
const welcome = _import('page/welcome')
/* error page */
const Err404 = _import('404')
/* login */
const Login = _import('login/index')

Vue.use(Router)

Vue.prototype.constantRouterMap = [
  { path: '/login', components: Login, hidden: true },
  { path: '/404', components: Err404, hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    name: '首页',
    icon: 'zujian',
    noDropdown: true,
    hidden: true,
    children: [
      { path: 'index', components: welcome }
    ]
  }
]

export default new Router({
})
