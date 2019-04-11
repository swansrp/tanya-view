import {getRequest} from '@/api/api'

export const getMenuTree = (router, store) => {
  if (store.state.menu.length > 0) {
    return
  }
  getRequest('/menu/query').then(resp => {
    if (resp && resp.status === 200) {
      let menu = formatRoutes(resp.data.data)
      router.addRoutes(menu)
      // console.log(JSON.stringify(menu, null, '\t'))
      store.commit('initMenu', menu)
    }
  })
}

function formatRoutes (routes) {
  let fmRoutes = []
  routes.forEach(router => {
    let {
      menu,
      subMenu
    } = router
    if (subMenu && subMenu instanceof Array) {
      subMenu = formatRoutes(subMenu)
    }
    let fmRouter = {
      path: menu.path,
      name: menu.name,
      iconUrl: menu.iconUrl,
      permission: menu.permission,
      children: subMenu,
      component (resolve) {
        require(['@/components' + menu.path], resolve)
      }
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}
