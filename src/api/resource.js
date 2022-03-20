import request from '@/utils/request'

const api = {
  menuResource: '/menuResource/list/all',
  rolePermission: '/rolePermission/list',
  addRolePermission: '/rolePermission/list/build',
  deleteRolePermission: '/rolePermission/list/delete',
  permissionList: '/permission/list/all',
  permission: '/permission/list',
  addPermission: '/permission/list/build',
  deletePermission: '/permission/list/delete'
}

export default api

export function getMenuResourceList (parameter) {
  return request({
    url: api.menuResource,
    params: parameter
  })
}

export function getRolePermissionList (parameter) {
  return request({
    url: api.rolePermission,
    params: parameter
  })
}

export function addRolePermission (data) {
  return request({
    url: api.addRolePermission,
    method: 'post',
    data
  })
}

export function deleteRolePermission (data) {
  return request({
    url: api.deleteRolePermission,
    method: 'delete',
    data
  })
}

export function getPermissionList (parameter) {
  return request({
    url: api.permissionList,
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permission,
    params: parameter
  })
}

export function addPermission (data) {
  return request({
    url: api.addPermission,
    method: 'post',
    data
  })
}

export function deletePermission (data) {
  return request({
    url: api.deletePermission,
    method: 'delete',
    data
  })
}
