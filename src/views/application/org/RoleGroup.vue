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
          <a-form-item label="组织">
            <a-select v-model="recordData.id" style="width:200px;" disabled>
              <a-select-option v-for="item in orgListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
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
            <span :class="{ 'danger': text === 'Disable', 'success': text === 'Enable' }">{{ roleStatus[text] }}</span>
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
import { getRoleGroupList } from '@/api/role'
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
      loadData: parameter => {
        return getRoleGroupList({ appId: this.appId, curPage: 1, pageSize: -1 }).then(res => res)
      },
      selectedRowKeys: [],
      selectedRows: [],
      recordData: {},
      appId: '',
      type: '',
      columns: [
        {
          title: '应用',
          align: 'center',
          dataIndex: 'appId',
          customRender: (text) => this.appListState[text]
        },
        {
          title: '角色组',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: (text) => this.$toLocalTime(text)
        }
      ]
    }
  },
  methods: {
    open (data, type) {
      Object.assign(this, {
        visible: true,
        selectedRowKeys: [],
        selectedRows: [],
        recordData: data,
        appId: data.appId,
        type
      })
      this.handerAppchange(data.appId)
      this.handleCollapse(!0)
    },
    initSelectsd () {
      this.selectedRows = this.orgRoleListStateOptions.filter(el => el.type === 'Role_Group' && el.orgId === this.recordData.id && el.appId === this.appId)
      this.selectedRowKeys = this.selectedRows.map(el => el.roleGroup.id)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    add () {
      const { selectedRowKeys, recordData: { id }, appId, type } = this
      if (selectedRowKeys.length) {
        const data = selectedRowKeys.map(el => {
          return {
            type,
            appId,
            orgId: id,
            roleId: el
          }
        })
        this.$put('/orgRole/list/modify', data, res => {
          if (res) {
            this.$store.dispatch('GetListState', 'orgRoleListState')
            this.$bus.$emit('updateOrgRoleList')
            this.onClose()
          }
        })
      } else {
        this.$notification.error({ message: '请选择角色组！' })
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
    ...mapGetters(['sideCollapsed', 'microAppListStateOptions', 'orgListStateOptions', 'roleStatus', 'appListState', 'orgRoleListStateOptions']),
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
