import { listToTree } from '@/utils/util'
import { BasicLayout, BlankLayout } from '@/layouts'

const constantRouterComponents = {
  'BasicLayout': window.__POWERED_BY_QIANKUN__ ? BlankLayout : BasicLayout,
  'RouteView': () => import('@/layouts/RouteView'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  'App': () => import('@/views/application/app'),
  'Org': () => import('@/views/application/org'),
  'User': () => import('@/views/application/user'),
  'OrgRole': () => import('@/views/application/orgRole'),
  'UserRole': () => import('@/views/application/userRole'),
  'MenuResource': () => import('@/views/resource/menuResource'),
  'Permission': () => import('@/views/resource/permission'),
  'Role': () => import('@/views/role/role'),
  'RoleGroup': () => import('@/views/role/roleGroup'),
  'Online': () => import('@/views/dashboard/online'),
  'LoginLog': () => import('@/views/log/loginLog'),
  'OptLog': () => import('@/views/log/operateLog'),
  'GatewayRoute': () => import('@/views/gatewayRoute/routeList')
}

const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

const rootRouter = {
  path: window.__POWERED_BY_QIANKUN__ && '/auth' || '/',
  name: 'index',
  component: constantRouterComponents['BasicLayout'],
  redirect: '/',
  meta: {
    title: '首页'
  },
  children: []
}

export const generatorDynamicRouter = (data) => {
  return new Promise((resolve, reject) => {
    const menuNav = []
    rootRouter.children = listToTree(data, '-1')
    menuNav.push(rootRouter)
    const routers = generator(menuNav)
    !window.__POWERED_BY_QIANKUN__ && routers.push(notFoundRouter)
    routers.forEach(el => {
      if (el.name === 'index') {
        const child = el.children && el.children.length && el.children[0] || el.children
        if (child) {
          el.redirect = child.path
        }
        child.redirect = child.children && child.children.length && child.children[0].path || '404'
      }
    })
    resolve(routers)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, show, icon, path, name } = item
    const currentRouter = {
      path,
      name,
      meta: {
        title,
        icon: icon || undefined,
        permission: item.name
      }
    }
    if (item.preId) {
      if (item.preId === '-1') currentRouter.component = constantRouterComponents['RouteView']
      else {
        currentRouter.meta.keepAlive = item.keepAlive === 'Y'
        currentRouter.component = constantRouterComponents[item.name]
      }
    } else currentRouter.component = item.component
    if (show === 'N') {
      currentRouter.hidden = true
    }
    Reflect.has(item, 'redirect') && (currentRouter.redirect = item.redirect)
    if (item.children && item.children.length > 0) {
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
