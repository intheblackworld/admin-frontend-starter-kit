import request from '@/utils/request'

const api = {
  routeList: '/gatewayRoute/list'
}

export default api

export function getRouteList (parameter) {
  return request({
    url: api.routeList,
    params: parameter
  })
}
