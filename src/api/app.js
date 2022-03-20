import request from '@/utils/request'

const api = {
  app: '/app/list',
  org: '/org/list',
  user: '/rbacUser/list',
  orgRole: '/orgRole/list',
  userRole: '/userRole/list'
}

export default api

export function getAppList (parameter) {
  return request({
    url: api.app,
    params: parameter
  })
}

export function getOrgList (parameter) {
  return request({
    url: api.org,
    params: parameter
  })
}

export function getUserList (parameter) {
  return request({
    url: api.user,
    params: parameter
  })
}

export function getOrgRoleList (parameter) {
  return request({
    url: api.orgRole,
    params: parameter
  })
}

export function getUserRoleList (parameter) {
  return request({
    url: api.userRole,
    params: parameter
  })
}
