import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import storage from 'store'
import router from '@/router'
import md5 from 'md5'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const apiUrlList = ['/login', '/google/check', '/captcha', '/logout']
const infoList = ['/permission/user/list', '/kickout']
const appListUrls = ['/app/list', '/app/modify']

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 12000
})
let needLoadingRequestCount = 0
// 异常拦截处理器
const errorHandler = (error) => {
  hideLoading()
  if (error.response) {
    const data = error.response.data
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    if (error.response.status === 500) {
      notification.error({
        message: error.response.statusText || 'Internal Server Error',
        description: data.message || data
      })
    }
    if (error.response.status === 502) {
      notification.error({
        message: data.error || '502 Bad Gateway',
        description: 'Failed to complete tunnel connection'
      })
    }
    if (error.response.status === 404) {
      notification.error({
        message: data.error || '404  Not Found',
        description: data || '404  Not Found'
      })
    }
  } else {
    notification.error({ message: '错误提示', description: '请求超时!' })
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  showLoading()
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = token
  }
  config.headers['Content-Type'] = config.headers['Content-Type'] ? config.headers['Content-Type'] : 'application/json'
  if (apiUrlList.includes(config.url)) {
    config.baseURL = process.env.VUE_APP_API_BASE_URL_LOGIN
  }
  if (config.url.includes('gatewayRoute')) {
    config.baseURL = process.env.VUE_APP_API_BASE_URL_LOGIN
  }
  if (infoList.includes(config.url)) {
    config.baseURL = process.env.VUE_APP_API_BASE_URL_INDFO
  }
  if (store.getters.appId) {
    if (!config.url.includes('/res/enum')) {
      if (appListUrls.includes(config.url)) {
        config.params ? (config.params.pageSize !== -1 && (config.params.id = store.getters.appId)) : config.data.id = store.getters.appId
      } else config.params ? (config.params.pageSize !== -1 && (config.params.appId = store.getters.appId)) : config.data.appId = store.getters.appId
    }
  }
  if (config.data && config.data.password) {
    if (config.data.password === '****') {
      Reflect.deleteProperty(config.data, 'password')
    } else config.data.password = md5(config.data.password)
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  hideLoading()
  const token = storage.get(ACCESS_TOKEN)
  if (response.data.code === '0000' && response.config.url !== '/google/check' && response.config.url !== '/login') {
    const token = response.headers.authorization
    if (token) {
      storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
      store.commit('SET_TOKEN', token)
    }
  }
  if (response.data && response.data.code === '9010' && token) {
    store.dispatch('Logout').then(() => {
      router.push({ name: 'login' }).catch(err => {
        console.log(err)
      })
    })
    notification.error({
      message: '错误提示',
      description: '登录失效，请重新登录'
    })
  }
  return response.data
}, errorHandler)

function showLoading () {
  needLoadingRequestCount === 0 && Vue.prototype.$loading.show({ tip: '拼命加载中...' })
  needLoadingRequestCount++
}
function hideLoading () {
  needLoadingRequestCount--
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0)
  needLoadingRequestCount === 0 && Vue.prototype.$loading.hide()
}
const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
