const getters = {
  isMobile: state => state.app.isMobile,
  sideCollapsed: state => state.app.sideCollapsed,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  appIcon: state => state.user.appIcon,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  optPermissionList: state => state.user.optPermissionList,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  resCodes: state => state.user.code,
  errorCodes: state => state.user.error,
  systemUser: state => state.enumerate.systemUser,
  roleState: state => state.enumerate.roleState,
  yNEnum: state => state.enumerate.yNEnum,
  yNEnumOptions: state => state.enumerate.yNEnumOptions,
  appState: state => state.enumerate.appState,
  appStateOptions: state => state.enumerate.appStateOptions,
  appSessionType: state => state.enumerate.appSessionType,
  appSessionTypeOptions: state => state.enumerate.appSessionTypeOptions,
  orgStatus: state => state.enumerate.orgStatus,
  orgStatusOptions: state => state.enumerate.orgStatusOptions,
  orgListState: state => state.enumerate.orgListState,
  orgListStateOptions: state => state.enumerate.orgListStateOptions,
  microOrgListStateOptions: state => {
    if (state.user.appId) {
      return state.enumerate.orgListStateOptions.filter(el => el.appId === state.user.appId)
    } else return state.enumerate.orgListStateOptions
  },
  orgListStateFilterOptions: state => state.enumerate.orgListStateFilterOptions,
  appListState: state => state.enumerate.appListState,
  appListStateOptions: state => {
    if (state.user.appId) {
      return state.enumerate.appListStateOptions.filter(el => el.id === state.user.appId)
    } else return state.enumerate.appListStateOptions
  },
  appListStateFilterOptions: state => {
    if (state.user.appId) {
      return state.enumerate.appListStateFilterOptions.filter(el => el.id === state.user.appId)
    } else return state.enumerate.appListStateFilterOptions
  },
  microAppListStateOptions: state => {
    if (state.user.appId) {
      return state.enumerate.appListStateOptions.filter(el => el.id === state.user.appId || el.name === '权限系统')
    } else return state.enumerate.appListStateOptions
  },
  userStatus: state => state.enumerate.userStatus,
  userStatusOptions: state => state.enumerate.userStatusOptions,
  roleStatus: state => state.enumerate.roleStatus,
  roleStatusOptions: state => state.enumerate.roleStatusOptions,
  roleType: state => state.enumerate.roleType,
  roleTypeOptions: state => state.enumerate.roleTypeOptions,
  microAppRoleTypeOptions: state => state.enumerate.roleTypeOptions.filter(el => el.value !== 'Super'),
  roleGroupStatus: state => state.enumerate.roleGroupStatus,
  roleGroupStatusOptions: state => state.enumerate.roleGroupStatusOptions,
  orgRoleType: state => state.enumerate.orgRoleType,
  orgRoleTypeOptions: state => state.enumerate.orgRoleTypeOptions,
  orgRoleStatus: state => state.enumerate.orgRoleStatus,
  orgRoleStatusOptions: state => state.enumerate.orgRoleStatusOptions,
  userListState: state => state.enumerate.userListState,
  userListStateOptions: state => state.enumerate.userListStateOptions,
  userListStateFilterOptions: state => state.enumerate.userListStateFilterOptions,
  menuResourceStatus: state => state.enumerate.menuResourceStatus,
  menuResourceStatusOptions: state => state.enumerate.menuResourceStatusOptions,
  menuResourceType: state => state.enumerate.menuResourceType,
  menuResourceTypeOptions: state => state.enumerate.menuResourceTypeOptions,
  appId: state => state.user.appId,
  initAppId: state => state.user.appId,
  rbacAppId: state => state.user.rbacAppId,
  roleListState: state => state.enumerate.roleListState,
  roleListStateOptions: state => state.enumerate.roleListStateOptions,
  roleGroupListState: state => state.enumerate.roleGroupListState,
  roleGroupListStateOptions: state => state.enumerate.roleGroupListStateOptions,
  userRoleListState: state => state.enumerate.userRoleListState,
  userRoleListStateOptions: state => state.enumerate.userRoleListStateOptions,
  orgRoleListState: state => state.enumerate.orgRoleListState,
  orgRoleListStateOptions: state => state.enumerate.orgRoleListStateOptions,
  roleGroupRelationListState: state => state.enumerate.roleGroupRelationListState,
  roleGroupRelationListStateOptions: state => state.enumerate.roleGroupRelationListStateOptions,
  jwtType: state => state.enumerate.jwtType,
  jwtTypeOptions: state => state.enumerate.jwtTypeOptions
}

export default getters
