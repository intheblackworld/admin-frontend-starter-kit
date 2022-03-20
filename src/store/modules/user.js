import storage from 'store'
import { login, logout, getCode, getError, getInfo, getRbacUser } from '@/api/login'
import { ACCESS_TOKEN, ACCESS_NICKNAME } from '@/store/mutation-types'
import { firstLowerCase, changeIcon, menuInfo, arrayNonRepeatfy } from '@/utils/util'
import resCode from '@/store/enum-code'
import { resetRouter } from '@/router'
import actions from '@/shared/actions'

const clearStateArr = ['appListState', 'orgListState', 'userListState']

const user = {
  state: {
    token: '',
    name: '',
    avatar: '',
    roles: [],
    info: {},
    code: resCode,
    error: {},
    appId: '',
    rbacAppId: '',
    appIcon: '',
    optPermissionList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_ERROR: (state, error) => {
      state.error = error
    },
    SET_APPID: (state, appId) => {
      state.appId = appId
    },
    SET_RBACAPPID: (state, rbacAppId) => {
      state.rbacAppId = rbacAppId
    },
    SET_APPICON: (state, icon) => {
      state.appIcon = icon
    },
    SET_OPTPERMISSIONLIST: (state, optPermissionList) => {
      state.optPermissionList = optPermissionList
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo.data, userInfo.headers).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    LoginSuccess ({ commit }, { account, token }) {
      return new Promise((resolve, reject) => {
        storage.set(ACCESS_TOKEN, token, 7 * 24 * 60 * 60 * 1000)
        storage.set(ACCESS_NICKNAME, account, 7 * 24 * 60 * 60 * 1000)
        commit('SET_NAME', account)
        commit('SET_TOKEN', token)
        resolve()
      })
    },

    GetCode ({ commit }) {
      return new Promise((resolve, reject) => {
        getCode().then(res => {
          const codeObj = res.reduce((res, cur) => {
            const code = parseInt(Object.keys(cur)[0].split('=').pop().trim())
            const val = firstLowerCase(Object.values(cur).join())
            res[val] = code
            return res
          }, {})
          commit('SET_CODE', codeObj)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetError ({ commit }) {
      return new Promise((resolve, reject) => {
        getError().then(res => {
          commit('SET_ERROR', res)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        if (window.__POWERED_BY_QIANKUN__) {
          actions.onGlobalStateChange(state => {
            const { menus, info } = state
            menus && menuInfo(menus, info, commit, resolve, reject)
          }, true)
        } else {
          Promise.all([getInfo(), getRbacUser()]).then(([infoData, userData]) => {
            if (infoData.code === '0000' && userData.code === '0000') {
              menuInfo(arrayNonRepeatfy(infoData.data), userData.data, commit, resolve, reject)
              if (userData.data.app && userData.data.app.logo) {
                commit('SET_APPICON', userData.data.app.logo)
                changeIcon(userData.data.app.logo)
              }
            } else reject(new Error('getInfo: request error!'))
          }).catch(error => {
            reject(error)
          })
        }
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_APPID', '')
          commit('SET_ROLES', [])
          clearStateArr.forEach(el => {
            commit('SET_LISTOPTIONS', [el, [], [], []])
          })
          storage.remove(ACCESS_TOKEN)
          storage.remove(ACCESS_NICKNAME)
          resetRouter()
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_APPID', '')
          commit('SET_ROLES', [])
          clearStateArr.forEach(el => {
            commit('SET_LISTOPTIONS', [el, [], [], []])
          })
          storage.remove(ACCESS_TOKEN)
          storage.remove(ACCESS_NICKNAME)
        })
      })
    }
  }
}

export default user
