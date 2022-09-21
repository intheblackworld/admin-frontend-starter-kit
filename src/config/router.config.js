// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView } from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/application/app',
    children: [
      {
        path: '/application',
        component: RouteView,
        redirect: '/application/app',
        meta: { title: '应用管理', icon: 'gold' },
        children: [
          {
            path: '/application/app',
            name: 'App',
            component: () => import('@/views/application/app'),
            meta: { title: '应用列表', keepAlive: true }
          },
          {
            path: '/application/org',
            name: 'Org',
            component: () => import('@/views/application/org'),
            meta: { title: '组织管理', keepAlive: true }
          },
          {
            path: '/application/user',
            name: 'User',
            component: () => import('@/views/application/user'),
            meta: { title: '用户管理', keepAlive: true }
          },
          {
            path: '/application/orgRole',
            name: 'OrgRole',
            component: () => import('@/views/application/orgRole'),
            meta: { title: '组织角色', keepAlive: true }
          },
          {
            path: '/application/userRole',
            name: 'UserRole',
            component: () => import('@/views/application/userRole'),
            meta: { title: '用户角色', keepAlive: true }
          }
        ]
      }
      // {
      //   path: '/resource',
      //   component: RouteView,
      //   redirect: '/resource/menuResource',
      //   meta: { title: '资源管理', icon: 'gold' },
      //   children: [
      //     {
      //       path: '/resource/menuResource',
      //       name: 'MenuResource',
      //       component: () => import('@/views/resource/menuResource'),
      //       meta: { title: '菜单资源', keepAlive: true }
      //     },
      //     {
      //       path: '/resource/permission',
      //       name: 'Permission',
      //       component: () => import('@/views/resource/permission'),
      //       meta: { title: '权限管理', keepAlive: true }
      //     }
      //   ]
      // },
      // {
      //   path: '/role',
      //   component: RouteView,
      //   redirect: '/role/role',
      //   meta: { title: '角色管理', icon: 'gold' },
      //   children: [
      //     {
      //       path: '/role/role',
      //       name: 'Role',
      //       component: () => import('@/views/role/role'),
      //       meta: { title: '角色管理', keepAlive: true }
      //     },
      //     {
      //       path: '/role/roleGroup',
      //       name: 'RoleGroup',
      //       component: () => import('@/views/role/roleGroup'),
      //       meta: { title: '角色组管理', keepAlive: true }
      //     }
      //   ]
      // }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
