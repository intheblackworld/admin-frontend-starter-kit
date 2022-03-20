import { getSelect } from '@/api'
import listFn from './listState'
import { getAddCommit } from '@/utils/util'
export default {
  state: {
    systemUser: {},
    roleState: {},
    yNEnum: {},
    yNEnumOptions: [],
    appState: {},
    appStateOptions: [],
    appSessionType: {},
    appSessionTypeOptions: [],
    orgStatus: {},
    orgStatusOptions: [],
    orgListState: {},
    orgListStateOptions: [],
    orgListStateFilterOptions: [],
    appListState: {},
    appListStateOptions: [],
    appListStateFilterOptions: [],
    userStatus: {},
    userStatusOptions: [],
    roleStatus: {},
    roleStatusOptions: [],
    roleType: {},
    roleTypeOptions: [],
    roleGroupStatus: {},
    roleGroupStatusOptions: [],
    orgRoleType: {},
    orgRoleTypeOptions: [],
    orgRoleStatus: {},
    orgRoleStatusOptions: [],
    userListState: {},
    userListStateOptions: [],
    userListStateFilterOptions: [],
    menuResourceStatus: {},
    menuResourceStatusOptions: [],
    menuResourceType: {},
    menuResourceTypeOptions: [],
    roleListState: {},
    roleListStateOptions: [],
    roleGroupListState: {},
    roleGroupListStateOptions: [],
    userRoleListState: {},
    userRoleListStateOptions: [],
    orgRoleListState: {},
    orgRoleListStateOptions: [],
    roleGroupRelationListState: {},
    roleGroupRelationListStateOptions: [],
    jwtType: {},
    jwtTypeOptions: []
  },
  mutations: {
    SET_LISTOPTIONS: (state, data) => {
      state[data[0] + 'Options'] = data[1]
      state[data[0]] && (state[data[0]] = data[2])
      state[data[0] + 'FilterOptions'] && (state[data[0] + 'FilterOptions'] = data[3])
    },
    SET_ENUM: (state, data) => {
      state[data[2]] = data[0]
      state[data[2] + 'Options'] = data[1]
    }
  },
  actions: {
    GetListState ({ commit }, stateName) {
      getAddCommit(listFn[stateName], commit, stateName)
    },
    GetEnum ({ commit }, data) {
      return new Promise(resolve => {
        getSelect(data[0]).then(res => {
          const options = Object.keys(res).map(el => {
            return {
              label: res[el],
              value: el
            }
          })
          commit('SET_ENUM', [res, options, data[1]])
          resolve(res)
        })
      })
    }
  }
}
