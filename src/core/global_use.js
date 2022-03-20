import moment from 'moment'
import { post, globalConfirm, validator, validatorO, put, del } from '@/api'
import { globalOpendialog, handlerDelete, globalOpenDetail } from '@/utils/util'
import Vue from 'vue'
const EventBus = new Vue()

export default (Vue) => {
  Object.defineProperties(Vue.prototype, {
    $post: {
      get: () => post
    },
    $globalConfirm: {
      get: () => globalConfirm
    },
    $validator: {
      get: () => validator
    },
    $validatorO: {
      get: () => validatorO
    },
    $put: {
      get: () => put
    },
    $del: {
      get: () => del
    },
    $bus: {
      get: () => EventBus
    },
    $isModify: {
      get: () => (obj, key = 'id') => Reflect.has(obj, key)
    },
    $globalHandlerDelete: {
      get: () => handlerDelete
    },
    $toLocalTime: {
      get: () => (dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') => moment(dataStr).format(pattern)
    },
    $toUtcTime: {
      get: () => (dataStr) => moment(dataStr).utc().format()
    },
    $globalOpendialog: {
      get: () => globalOpendialog
    },
    $globalOpenDetail: {
      get: () => globalOpenDetail
    }
  })
}
