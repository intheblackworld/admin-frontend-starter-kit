<template>
  <div>
    <a-drawer
      placement="right"
      :width="barWidth"
      :visible="visible"
      @close="onClose">
      <div>
        <a-form layout="inline" style="margin-bottom: 30px;margin-top: 30px;">
          <a-form-item label="应用">
            <a-select v-model="appId" style="width:200px;" @change="handerAppchange">
              <a-select-option v-for="item in microAppListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="用户">
            <a-select v-model="recordData.id" style="width:200px;" disabled>
              <a-select-option v-for="item in userListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
        <s-table
          rowKey="id"
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :showPagination="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
          <template #status="text">
            <span :class="{ 'danger': text === 'Disable', 'success': text === 'Enable' }">{{ orgRoleStatus[text] }}</span>
          </template>
        </s-table>
        <div class="bottom-btn" style="margin-top: 30px;">
          <a-button type="primary" @click="add" size="large" style="margin: 0 20%;width: 150px;">保存</a-button>
          <a-button @click="(selectedRowKeys = [], selectedRows = [])" size="large" style="width: 150px;">重置</a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { STable } from '@/components'
import { getOrgRoleList } from '@/api/app'
export default {
  components: { STable },
  inject: {
    handleCollapse: {
      type: Function
    }
  },
  data () {
    return {
      visible: false,
      recordData: {},
      appId: '',
      loadData: parameter => {
        return getOrgRoleList({ appId: this.appId, curPage: 1, pageSize: -1 }).then(res => res)
      },
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: '应用',
          align: 'center',
          dataIndex: 'app.name',
          customRender: (text, record) => text || this.appListState[record.appId]
        },
        {
          title: '组织',
          align: 'center',
          dataIndex: 'orgId',
          customRender: (text) => this.orgListState[text]
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          customRender: (text) => this.orgRoleType[text]
        },
        {
          title: '角色(组)名',
          align: 'center',
          customRender: (text, record) => {
            if (record.type === 'Role_Group') return record.roleGroup && record.roleGroup.name || this.roleGroupListState[record.roleId] || ''
            else return this.roleListState[record.roleId]
          }
          // customRender: (text, record) => {
          //   if (record.type === 'Role_Group') return record.roleGroup && record.roleGroup.name || ''
          //   else return record.role && record.role.name || ''
          // }
        },
        {
          title: '角色类型',
          align: 'center',
          customRender: (text, record) => {
            if (record.type === 'Role_Group') return '/'
            else if (record.role) {
              return this.roleType[record.role.type]
            } else return record.roleId
          }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        }
      ]
    }
  },
  methods: {
    open (data) {
      Object.assign(this, {
        visible: true,
        selectedRowKeys: [],
        selectedRows: [],
        appId: data.appId,
        recordData: data
      })
      this.handerAppchange(data.appId)
      this.handleCollapse(!0)
    },
    initSelectsd () {
      const selectedData = this.userRoleListStateOptions.filter(el => el.userId === this.recordData.id && el.appId === this.appId)
      this.selectedRows = this.orgRoleListStateOptions.filter(item => item.appId === this.appId).filter(el => {
        return selectedData.find(item => item.type === el.type && item.roleId === el.roleId && item.orgId === el.orgId)
      })
      this.selectedRowKeys = this.selectedRows.map(el => el.id)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    add () {
      const { selectedRows, recordData: { id }, appId } = this
      if (selectedRows.length) {
        const data = selectedRows.map(el => {
          return {
            appId,
            userId: id,
            roleId: el.roleId,
            type: el.type,
            orgId: el.orgId
          }
        })
        this.$put('/userRole/list/modify', data, res => {
          if (res) {
            this.$store.dispatch('GetListState', 'userRoleListState')
            this.$bus.$emit('updateUserRoleList')
            this.onClose()
          }
        })
      } else {
        this.$notification.error({ message: '请选择角色！' })
      }
    },
    onClose () {
      this.handleCollapse(!1)
      this.visible = false
    },
    handerAppchange (val) {
      Object.assign(this, {
        appId: val
      })
      this.$refs.table && this.$refs.table.refresh(true)
      this.$nextTick(() => {
        this.initSelectsd()
      })
    }
  },
  computed: {
    ...mapGetters(['sideCollapsed', 'microAppListStateOptions', 'userListStateOptions', 'roleType', 'orgRoleStatus', 'orgListState', 'orgRoleType', 'appListState', 'roleGroupListState', 'roleListState', 'userRoleListStateOptions', 'orgRoleListStateOptions']),
    barWidth () {
      return `calc(100% - ${this.sideCollapsed ? 80 : 256}px)`
    }
  }
}

</script>

<style>
.bottom-btn {
  width: 50%;
  margin: 0 auto;
}
</style>
