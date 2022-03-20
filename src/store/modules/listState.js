import { getAppList, getOrgList, getUserList, getUserRoleList, getOrgRoleList } from '@/api/app'
import { getRoleList, getRoleGroupList, getRoleGroupRelationList } from '@/api/role'
export default {
  appListState: getAppList,
  orgListState: getOrgList,
  userListState: getUserList,
  roleListState: getRoleList,
  roleGroupListState: getRoleGroupList,
  userRoleListState: getUserRoleList,
  orgRoleListState: getOrgRoleList,
  roleGroupRelationListState: getRoleGroupRelationList
}
