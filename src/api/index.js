import Vue from 'vue'
import { axios } from '@/utils/request'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'

export function post(url, data, cb, type) {
  if (type) {
    axios({
      url,
      method: 'post',
      params: data
    }).then(res => {
      successCb(res, cb)
    })
  } else {
    axios({
      url,
      method: 'post',
      data
    }).then(res => {
      successCb(res, cb)
    })
  }
}

export function put(url, data, cb, type) {
  if (type) {
    axios.put(url, null, { params: data }).then(res => {
      successCb(res, cb)
    })
  } else {
    axios({
      url,
      method: 'put',
      data
    }).then(res => {
      successCb(res, cb)
    })
  }
}

export function del(url, data, cb, type) {
  if (type) {
    axios({
      url,
      method: 'delete',
      params: data
    }).then(res => {
      successCb(res, cb)
    })
  } else {
    axios({
      url,
      method: 'delete',
      data
    }).then(res => {
      successCb(res, cb)
    })
  }
}

export function confirmDel(content, url, data, cb, type) {
  Vue.prototype.$confirm({
    title: '提示',
    content,
    onOk: () => {
      del(url, data, cb, type)
    }
  })
}

export function confirmPost(content, url, data, cb, type, okText = '确定') {
  Vue.prototype.$confirm({
    title: '提示',
    content,
    okText,
    onOk: () => {
      post(url, data, cb, type)
    }
  })
}

export function globalConfirm (content, url, data, cb, okText = '确定') {
  Vue.prototype.$confirm({
    title: '提示',
    content,
    okText,
    onOk: () => {
      post(url, data, cb)
    }
  })
}

export function validator (message, length, obj) {
  if (message && !length && !obj) {
    return [{ required: true, message }]
  }
  if (typeof length === 'object') {
    !length.pattern && (length.pattern = /^[^\s]*$/)
    !length.message && (length.message = '不可以输入空格')
    return [{ required: true, message }, { pattern: length.pattern, message: length.message }]
  } else {
    if (obj) {
      !obj.pattern && (obj.pattern = /^[^\s]*$/)
      !obj.message && (obj.message = '不可以输入空格')
      return [{ required: true, message }, { max: length, message: `输入长度不可以超过${length}位` }, { pattern: obj.pattern, message: obj.message }]
    } else {
      return [{ required: true, message }, { max: length, message: `输入长度不可以超过${length}位` }]
    }
  }
}

export function validatorCode (message) {
  const required = !!message
  return [{ required, message }, { pattern: /^[A-Za-z0-9_]{4,16}$/, message: '4~16位由数字、字母、下划线组成' }]
}

export function validatorName (message) {
  const required = !!message
  return [{ required, message }, { min: 2, message: '输入长度2~16位' }, { max: 16, message: `输入长度2~16位` }]
}

export function validatorSummary (message) {
  const required = !!message
  return [{ required, message }, { max: 30, message: `输入长度在30位以内` }]
}

export const validatorO = {
  code: validatorCode,
  name: validatorName,
  summary: validatorSummary
}

export function getSelect (code) {
  return axios({
    url: '/res/enum/' + code
  })
}

export function successCb(res, cb) {
  if (res) {
    const { code, msg } = res
    const t = !0
    if (code === '0000') {
      let message
      if (msg) {
        message = msg
      } else {
        message = '操作成功'
      }
      notification.success({ message })
      cb(t)
    } else {
      const errorMsg = store.getters.errorCodes
      const f = !1
      let message
      if (msg) {
        message = msg
      } else if (errorMsg[code]) {
        message = errorMsg[code]
      } else {
        message = '操作失败'
      }
      notification.error({ message })
      cb(f)
    }
  } else {
    notification.open({ message: '无返回信息！' })
  }
}
