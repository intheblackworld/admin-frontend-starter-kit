import request from '@/utils/request'

const userApi = {
  Login: '/login',
  Logout: '/logout',
  ResCode: '/res/enum/codes',
  UserInfo: '/permission/user/list',
  ErrorCode: '/res/enum/error',
  google: '/google/check',
  rbacUser: '/rbacUser/load'
}

export function login (parameter, headers) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter,
    headers
  })
}

export function getCode () {
  return request({
    url: userApi.ResCode
  })
}

export function getError () {
  return request({
    url: userApi.ErrorCode
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo
  })
}

export function getRbacUser () {
  return request({
    url: userApi.rbacUser
  })
}

export function logout () {
  return request({
    url: userApi.Logout
  })
}

export function googleCode (params, { headers }) {
  return request({
    url: userApi.google,
    params,
    headers
  })
}
