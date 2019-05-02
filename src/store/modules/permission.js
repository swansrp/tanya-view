// import Layout from '@/views/layout/Layout'
// import Welcome from '@/views/page/welcome.vue'
import Vue from 'vue'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
function hasPermission (roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return true
  }
}
*/
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles

function filterAsyncRouter (asyncRouterMap, roles) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}
 */

const permission = {
  state: {
    routers: Vue.prototype.constantRouterMap,
    addRouters: [],
    supportRouter: {}
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = Vue.prototype.constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({commit}) {
      return new Promise((resolve, reject) => {
        Vue.prototype.fetch(Vue.prototype.apiType.getMenu, null, null,
          respData => {
            let accessedRouters = construction(respData.data)
            commit('SET_ROUTERS', accessedRouters)
            resolve()
          })
      })
    }
  }
}

function construction (routes) {
  let fmRoutes = []
  routes.forEach(router => {
    let {
      menu,
      subMenu
    } = router
    if (subMenu && subMenu instanceof Array) {
      subMenu = construction(subMenu)
    }
    let fmRouter = {
      path: menu.path,
      name: menu.name,
      icon: menu.iconUrl,
      permission: menu.permission,
      children: subMenu,
      component (resolve) {
        if (menu.path === '/') {
          require(['@/views/layout/Layout'], resolve)
        } else {
          require(['@/views' + menu.path], resolve)
        }
      },
      noDropdown: subMenu.length === 0
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}

export default permission
