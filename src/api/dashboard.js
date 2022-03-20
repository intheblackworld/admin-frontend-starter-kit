import request from '@/utils/request'

const api = {
  onlineList: '/user/online/list'
}

export default api

export function getOnlineList (parameter) {
  return request({
    url: api.onlineList,
    params: parameter
  })
}
