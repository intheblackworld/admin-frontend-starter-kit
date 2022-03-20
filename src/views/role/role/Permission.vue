<template>
  <a-form :form="form">
    <a-form-item label="权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-tree
        checkable
        style="margin-left:20px;"
        @check="onCheck"
        :replaceFields="replaceFields"
        v-model="checkedKeys"
        :treeData="treeMenus"/>
    </a-form-item>
  </a-form>
</template>

<script>
import { listToTree, getHalfCheckd } from '@/utils/util'
import { getRolePermissionList, addRolePermission, deleteRolePermission, getPermissionList } from '@/api/resource'
export default {
  props: {
    record: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      form: this.$form.createForm(this),
      replaceFields: {
        children: 'children',
        title: 'permissionName',
        key: 'id'
      },
      allChecked: [],
      checkedKeys: [],
      halfChecked: [],
      treeMenus: [],
      permissionMenuList: []
    }
  },
  mounted () {
    const { record: { appId, id } } = this
    this.initTreeMenu(appId).then(() => {
      getRolePermissionList({ appId, roleId: id, curPage: 1, pageSize: -1 }).then(res => {
        const { permissionMenuList } = this
        const { data: { records } } = res
        const permissionAllChecked = records.map(el => el.permissionId)
        const authList = permissionMenuList.filter(el => permissionAllChecked.includes(el.permissionId))
        this.allChecked = authList.map(item => item.id)
        this.halfChecked = getHalfCheckd(permissionMenuList, authList, this.allChecked)
        this.checkedKeys = this.allChecked.filter(el => !this.halfChecked.includes(el))
      })
    })
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        const { form: { validateFields }, record: { appId, id }, checkedKeys, halfChecked, allChecked, permissionMenuList } = this
        validateFields((errors, values) => {
          if (!errors) {
            const allKeys = checkedKeys.concat(halfChecked)
            const intersection = allChecked.filter(el => allKeys.includes(el))
            const deleteKeys = allChecked.filter(el => !intersection.includes(el))
            const addKeys = allKeys.filter(el => !allChecked.includes(el))
            const deleteData = permissionMenuList.filter(el => deleteKeys.includes(el.id)).map(item => {
              return {
                appId,
                roleId: id,
                permissionId: item.permissionId
              }
            })
            const addData = permissionMenuList.filter(el => addKeys.includes(el.id)).map(item => {
              return {
                appId,
                roleId: id,
                permissionId: item.permissionId
              }
            })
            if (!deleteKeys.length && !addKeys.length) {
              resolve(true)
            }
            if (deleteKeys.length && addKeys.length) {
              Promise.all([addRolePermission(addData), deleteRolePermission(deleteData)]).then((values) => {
                if (values[0].code === '0000' && values[1].code === '0000') {
                  this.$notification.success({ message: '成功' })
                  resolve(true)
                } else this.$notification.error({ message: '失败' })
              })
            } else {
              if (deleteKeys.length) {
                deleteRolePermission(deleteData).then(res => {
                  const { code, msg } = res
                  if (code === '0000') {
                    this.$notification.success({ message: msg })
                    resolve(true)
                  } else this.$notification.error({ message: msg })
                })
              }
              if (addKeys.length) {
                this.$post('/rolePermission/list/build', addData, res => {
                  resolve(true)
                })
              }
            }
          }
        })
      })
    },
    onCheck (checkedKeys, e) {
      this.checkedKeys = checkedKeys
      this.halfChecked = e.halfCheckedKeys
    },
    initTreeMenu (appId) {
      return new Promise(async resolve => {
        const { code, data } = await getPermissionList({ appId, curPage: 1, pageSize: -1 })
        if (code === '0000') {
          const permissionMenuList = data.filter(item => item.resourceId).map(el => {
            if (el.menuResource) {
              el.menuResource.permissionName = el.name
              el.menuResource.permissionId = el.id
              return el.menuResource
            } else if (el.optResource) {
              el.optResource.permissionName = el.name
              el.optResource.permissionId = el.id
              el.optResource.preId = el.optResource.menuId
              return el.optResource
            }
          })
          this.permissionMenuList = permissionMenuList
          this.treeMenus = listToTree(permissionMenuList, '-1')
          resolve()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
