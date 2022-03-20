import request from '@/utils/request'

const api = {
  loginLog: '/loginLog/list',
  operateLog: '/optLog/list'
}

export default api

export function getLoginLog (parameter) {
  return request({
    url: api.loginLog,
    params: parameter
  })
}

export function getOperateLog (parameter) {
  return request({
    url: api.operateLog,
    params: parameter
  })
}
