import request from '@/utils/request'

const api = {
  role: '/role/list',
  roleGroup: '/roleGroup/list',
  roleGroupRelation: '/roleGroupRelation/list',
  addRoleGroupRelation: '/roleGroupRelation/list/build',
  deleteRoleGroupRelation: '/roleGroupRelation/list/delete'
}

export default api

export function getRoleList (parameter) {
  return request({
    url: api.role,
    params: parameter
  })
}

export function getRoleGroupList (parameter) {
  return request({
    url: api.roleGroup,
    params: parameter
  })
}

export function getRoleGroupRelationList (parameter) {
  return request({
    url: api.roleGroupRelation,
    params: parameter
  })
}

export function addRoleGroupRelation (data) {
  return request({
    url: api.addRoleGroupRelation,
    method: 'post',
    data
  })
}

export function deleteRoleGroupRelation (data) {
  return request({
    url: api.deleteRoleGroupRelation,
    method: 'delete',
    data
  })
}
