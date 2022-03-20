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
            <a-select v-model="appId" style="width:150px;" @change="handerAppchange">
              <a-select-option v-for="item in microAppListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="角色组">
            <a-input v-model="recordData.name" disabled/>
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
import { getRoleList, addRoleGroupRelation, deleteRoleGroupRelation } from '@/api/role'
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
        return getRoleList({ appId: this.appId, curPage: 1, pageSize: -1 }).then(res => res)
      },
      selectedRowKeys: [],
      selectedRows: [],
      recordData: {},
      appId: '',
      initSelectedRowKeys: [],
      columns: [
        {
          title: '角色',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          customRender: (text) => this.roleType[text]
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
      this.selectedRowKeys = this.roleGroupRelationListStateOptions.filter(el => el.roleGroupId === this.recordData.id).map(el => el.roleId)
      this.initSelectedRowKeys = this.roleGroupRelationListStateOptions.filter(el => el.roleGroupId === this.recordData.id).map(el => el.roleId)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    add () {
      const { selectedRowKeys, recordData: { id }, appId, initSelectedRowKeys } = this
      const deleteKeys = initSelectedRowKeys.filter(el => !selectedRowKeys.includes(el))
      const addKeys = selectedRowKeys.filter(el => !initSelectedRowKeys.includes(el))
      const deleteData = this.roleGroupRelationListStateOptions.filter(el => deleteKeys.includes(el.roleId)).map(el => {
        return { id: el.id }
      })
      const addData = addKeys.map(el => {
        return {
          appId,
          roleGroupId: id,
          roleId: el
        }
      })
      if (!deleteKeys.length && !addKeys.length) {
        this.$notification.success({ message: '成功！' })
        this.onClose()
      }
      if (deleteKeys.length && addKeys.length) {
        Promise.all([addRoleGroupRelation(addData), deleteRoleGroupRelation(deleteData)]).then((values) => {
          if (values[0].code === '0000' && values[1].code === '0000') {
            this.$notification.success({ message: '成功' })
            this.$store.dispatch('GetListState', 'roleGroupRelationListState')
            this.onClose()
          } else this.$notification.error({ message: '失败' })
        })
      } else {
        if (deleteKeys.length) {
          deleteRoleGroupRelation(deleteData).then(res => {
            const { code, msg } = res
            if (code === '0000') {
              this.$store.dispatch('GetListState', 'roleGroupRelationListState')
              this.onClose()
              this.$notification.success({ message: msg })
            } else this.$notification.error({ message: msg })
          })
        }
        if (addKeys.length) {
          this.$post('/roleGroupRelation/list/build', addData, res => {
            if (res) {
              this.$store.dispatch('GetListState', 'roleGroupRelationListState')
              this.onClose()
            }
          })
        }
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
    ...mapGetters(['sideCollapsed', 'microAppListStateOptions', 'roleType', 'roleStatus', 'roleGroupRelationListStateOptions']),
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
