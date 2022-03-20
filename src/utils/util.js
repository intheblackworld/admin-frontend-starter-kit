import store from '@/store'
import { confirmDel } from '@/api'

export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

export function welcome () {
  const arr = ['休息一会儿吧', '准备吃什么呢?', '要不要打一把 DOTA', '我猜你可能累了']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () {}
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        callback(direction)
        beforeScrollTop = afterScrollTop
      }, 50)
    },
    false
  )
}

export function isIE () {
  const bw = window.navigator.userAgent
  const compare = (s) => bw.indexOf(s) >= 0
  const ie11 = (() => 'ActiveXObject' in window)()
  return compare('MSIE') || ie11
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function guid () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
export function customRequest (option) {
  const formData = new window.FormData()
  formData.append('files[]', option.file)
  const reader = new window.FileReader()
  reader.readAsDataURL(option.file)
  reader.onloadend = function (e) {
    if (e && e.target && e.target.result) {
      option.onSuccess()
    }
  }
}

export function firstUpperCase ([first, ...rest]) {
  return first.toUpperCase() + rest.join('')
}

export function firstLowerCase ([first, ...rest]) {
  return first.toLowerCase() + rest.join('')
}

export function listToTree (list, preId, leaf = 'children') {
  const tree = []
  let temp
  list.forEach(el => {
    if (el.preId === preId) {
      const obj = el
      temp = listToTree(list, el.id, leaf)
      if (temp.length) {
        obj[leaf] = temp
      }
      tree.push(obj)
    }
  })
  return tree
}

export function tree2list (tree, list = []) {
  tree.forEach(node => {
    list.push(node)
    node.optList && tree2list(node.optList, list)
  })
  return list
}

export function permissionsRoles (list, res = []) {
  list.forEach(el => {
    res.push(el)
    if (el.systemResourceList && el.systemResourceList.length) {
      permissionsRoles(el.systemResourceList, res)
    }
  })
  return res
}

export function filterPreId (list, data, allChecked, res = []) {
  if (data.preId && data.preId !== '-1') {
    const preSource = list.find(el => el.id === data.preId)
    const children = list.filter(el => el.preId === data.id).map(item => item.id)
    const sameLevel = list.filter(el => el.preId === data.preId).map(item => item.id)
    const sameLevelIntersection = sameLevel.filter(el => allChecked.includes(el))
    if (sameLevel.length !== sameLevelIntersection.length) {
      res.push(data.preId)
    }
    if (children.length) {
      const childrenIntersection = children.filter(el => allChecked.includes(el))
      if (childrenIntersection.length !== children.length) {
        res.push(data.id)
        res.push(data.preId)
      }
    }
    if (preSource) filterPreId(list, preSource, allChecked, res)
  }
  return res
}

export function getHalfCheckd (list, authList, allChecked, childName) {
  let preIdList = []
  if (authList.length) {
    authList.forEach(el => {
      const ids = filterPreId(list, childName && el[childName] || el, allChecked)
      preIdList = preIdList.concat(ids)
    })
  }
  return [...new Set(preIdList)]
}

export function excludeAliveRouterNames (routers, res = []) {
  routers.forEach(el => {
    if (el.children && el.children.length) {
      excludeAliveRouterNames(el.children, res)
    } else {
      if (el.meta && !el.meta.keepAlive) {
        res.push(el.name)
      }
    }
  })
  return res
}

export const getAddCommit = async (fn, commit, stateName, params = { curPage: 1, pageSize: -1 }, key = 'id') => {
  const { data } = await fn(params)
  let option
  if (data && data.length) {
    option = data
  } else if (data && data.records && data.records.length) {
    option = data.records
  } else option = []
  const filterOptions = option.filter(el => el.status === 'Enable')
  const state = option.reduce((res, cur) => {
    res[cur[key]] = cur.name
    return res
  }, {})
  commit('SET_LISTOPTIONS', [stateName, option, state, filterOptions])
}

export const dialogSubmit = ({ form: { validateFields }, record, $put, $post, $store: { dispatch }, requestData }) => new Promise(resolve => {
  const { url, dispatchName, asigndata } = requestData
  validateFields((errors, values) => {
    if (!errors) {
      if (asigndata) {
        values = { ...values, ...asigndata }
      }
      if (record.id) {
        values = { id: record.id, ...values }
        $put(`${url}/modify`, values, res => {
          if (res) {
            if (dispatchName && record.name !== values.name) {
              dispatch('GetListState', dispatchName)
            }
            resolve(true)
          }
        })
      } else {
        $post(`${url}/build`, values, res => {
          if (res) {
            if (dispatchName) {
              dispatch('GetListState', dispatchName)
              if (dispatchName === 'appListState') dispatch('GetListState', 'orgListState')
            }
            resolve(true)
          }
        })
      }
    }
  })
})

export const globalOpendialog = (that, record = {}, modalProps = {}) => {
  const title = Reflect.has(record, 'id') && '编辑' || '新增'
  const bool = Reflect.has(record, 'id') ? !1 : !0
  that.$dialog(that.$options.components.AddModal,
    {
      record,
      on: {
        ok: () => {
          that.$refs.table.refresh(bool)
        }
      }
    },
    {
      title,
      ...modalProps
    }
  )
}

export const globalOpenDetail = (that, record, handleCollapse) => {
  that.$drawer(that.$options.components.DetailModal,
    {
      record,
      handleCollapse
    }
  )
}

export const handlerDelete = (url, data, refresh, dispatchName, type) => {
  confirmDel('确定删除当前数据吗？', url, data, res => {
    if (res) {
      if (dispatchName) {
        store.dispatch('GetListState', dispatchName)
      }
      refresh()
    }
  }, type)
}

export const randomPassword = (length = 16) => {
  const passwordArray = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz', '1234567890', '!@[]_%&,.()']
  const password = []
  let n = 0
  for (let i = 0; i < length; i++) {
    if (password.length < (length - 4)) {
      const arrayRandom = Math.floor(Math.random() * 4)
      const passwordItem = passwordArray[arrayRandom]
      const item = passwordItem[Math.floor(Math.random() * passwordItem.length)]
      password.push(item)
    } else {
      const newItem = passwordArray[n]
      const lastItem = newItem[Math.floor(Math.random() * newItem.length)]
      const spliceIndex = Math.floor(Math.random() * password.length)
      password.splice(spliceIndex, 0, lastItem)
      n++
    }
  }
  return password.join('')
}

export const changeIcon = (url) => {
  const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
  link.href = url
  document.getElementsByTagName('head')[0].appendChild(link)
}

export const menuInfo = (menus, info, commit, resolve, reject) => {
  if (!info || !info.appId) {
    reject('请求用户信息失败，请重试')
  }
  if (menus && menus.length) {
    let permissionData = []
    if (window.__POWERED_BY_QIANKUN__) {
      permissionData = menus.filter(el => el.name !== 'ExternalReq' && info.appId !== el.appId)
    } else permissionData = menus.filter(el => el.name !== 'ExternalReq' && info.appId === el.appId)
    if (!permissionData.length) {
      reject('无权限!请联系管理员添加权限')
      return
    }
    let permissionList = []
    menus.forEach(el => {
      if (el.optList && el.optList.length) permissionList = [...permissionList, ...el.optList]
    })
    let userPermissionList = permissionList.filter(el => el.status === 'Enable').map(item => item.code)
    const isSuper = info.roleList && info.roleList.find(el => el.type === 'Super')
    if (isSuper) {
      commit('SET_APPID', '')
    } else {
      userPermissionList = userPermissionList.filter(el => el !== 'app.build')
      commit('SET_APPID', info.appId)
    }
    commit('SET_ROLES', menus)
    commit('SET_INFO', info)
    commit('SET_AVATAR', info.avatar)
    commit('SET_OPTPERMISSIONLIST', userPermissionList)
    resolve(permissionData)
  } else {
    reject('无权限!请联系管理员添加权限')
  }
}

export const arrayNonRepeatfy = (arr) => {
  const array = arr.map(el => JSON.stringify(el))
  const filterArr = [...new Set(array)]
  return filterArr.map(el => JSON.parse(el))
}
