<template>
  <a-form :form="form">
    <a-form-item label="应用" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!initAppId">
      <a-select v-decorator="['appId', { rules: [{required: true, message: '请选择应用'}]} ]" placeholder="请选择" @change="appChange">
        <a-select-option v-for="item in appListStateFilterOptions" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-tree
        checkable
        style="margin-left: 150px;"
        @check="onCheck"
        :replaceFields="replaceFields"
        v-model="checkedKeys"
        :treeData="treeMenus"/>
    </a-form-item>
  </a-form>
</template>

<script>
import { mapGetters } from 'vuex'
import { listToTree, tree2list, getHalfCheckd } from '@/utils/util'
import { getMenuResourceList, getPermissionList, addPermission, deletePermission } from '@/api/resource'
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
        children: 'optList',
        title: 'title',
        key: 'id'
      },
      allChecked: [],
      checkedKeys: [],
      halfChecked: [],
      treeMenus: [],
      list: [],
      appId: '',
      authList: []
    }
  },
  computed: mapGetters(['appListStateFilterOptions', 'initAppId']),
  mounted () {
    this.initAppId && this.appChange(this.initAppId)
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        const { form: { validateFields }, checkedKeys, halfChecked, allChecked, appId } = this
        validateFields((errors, values) => {
          if (!errors) {
            const allKeys = checkedKeys.concat(halfChecked)
            const intersection = allChecked.filter(el => allKeys.includes(el))
            const deleteKeys = allChecked.filter(el => !intersection.includes(el))
            const addKeys = allKeys.filter(el => !allChecked.includes(el))
            const deleteData = deleteKeys.map(el => {
              const data = this.authList.find(item => item.resourceId === el)
              return {
                appId,
                id: data.id,
                type: data.type,
                resourceId: data.resourceId
              }
            })
            const addData = this.list.filter(el => addKeys.includes(el.id)).map(item => {
              return {
                appId: item.appId,
                resourceId: item.id,
                type: item.type
              }
            })
            if (!deleteKeys.length && !addKeys.length) {
              this.$notification.error({ message: '请选择菜单资源' })
            }
            if (deleteKeys.length && addKeys.length) {
              Promise.all([addPermission(addData), deletePermission(deleteData)]).then((values) => {
                if (values[0].code === '0000' && values[1].code === '0000') {
                  this.$notification.success({ message: '成功' })
                  resolve(true)
                } else this.$notification.error({ message: '失败' })
              })
            } else {
              if (deleteKeys.length) {
                deletePermission(deleteData).then(res => {
                  const { code, msg } = res
                  if (code === '0000') {
                    this.$notification.success({ message: msg })
                    resolve(true)
                  } else this.$notification.error({ message: msg })
                })
              }
              if (addKeys.length) {
                this.$post('/permission/list/build', addData, res => { resolve(true) })
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
        const { data } = await getMenuResourceList({ appId, curPage: 1, pageSize: -1 })
        this.treeMenus = listToTree(data.records, '-1', 'optList')
        this.list = tree2list(this.treeMenus).map(el => {
          el.menuId && (el.preId = el.menuId)
          if (el.type === 'Node') {
            el.type = 'Menu'
          } else if (el.type === 'Leaf') {
            el.type = 'Menu'
          } else el.type = 'Opt'
          return el
        })
        resolve(true)
      })
    },
    init (appId) {
      this.initTreeMenu(appId).then(() => {
        getPermissionList({ appId, curPage: 1, pageSize: -1 }).then(res => {
          const authList = res.data.filter(item => item.resourceId).map(el => {
            if (el.menuResource) el.systemResource = el.menuResource
            if (el.optResource) {
              el.optResource.preId = el.optResource.menuId
              el.systemResource = el.optResource
            }
            return el
          })
          this.authList = authList
          this.allChecked = authList.map(el => el.resourceId)
          this.halfChecked = getHalfCheckd(this.list, authList, this.allChecked, 'systemResource')
          this.checkedKeys = this.allChecked.filter(el => !this.halfChecked.includes(el))
        })
      })
    },
    appChange (value) {
      this.appId = value
      this.init(value)
    }
  }
}
</script>

<style scoped>
</style>
