<template>
  <div class="orgRole">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item v-if="!appId">
          <a-select v-model="queryParam.appId" style="width:150px;" placeholder="请选择应用" @change="appChange">
            <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-if="isSelectedApp">
          <a-select v-model="queryParam.orgId" style="width:150px;" placeholder="请选择组织">
            <a-select-option v-for="item in initOrgListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-else>
          <a-select v-model="queryParam.orgId" style="width:150px;" placeholder="请选择组织">
            <a-select-option v-for="item in microOrgListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.type" style="width:150px;" placeholder="请选择类型">
            <a-select-option v-for="item in orgRoleTypeOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.status" style="width:150px;" placeholder="请选择状态">
            <a-select-option v-for="item in orgRoleStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('orgRole.list')">查询</a-button>
          <a-button style="margin-left: 20px;" @click="() => { queryParam = {}, this.isSelectedApp = false }">重置</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #status="text, record">
          <span>
            <a-checkbox :checked="text === 'Enable'" @change="statusChange(record)"/>
          </span>
        </template>
        <template #action="text">
          <span>
            <template>
              <a-button type="danger" @click="$globalHandlerDelete('/orgRole/delete', { id: text }, $refs.table.refresh, 'orgRoleListState')" v-if="$auth('orgRole.delete')">删除</a-button>
            </template>
          </span>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOrgRoleList } from '@/api/app'
import { mapGetters } from 'vuex'
const listState = ['orgListStateOptions', 'appListStateOptions', 'roleGroupListStateOptions', 'roleListStateOptions']
const storeState = ['orgRoleStatusOptions', 'orgRoleTypeOptions']
export default {
  name: 'OrgRole',
  components: { STable },
  data () {
    return {
      queryParam: {},
      vue_compent: this,
      isSelectedApp: false,
      initOrgListStateOptions: [],
      columns: [
        {
          title: '角色(组)名',
          align: 'center',
          customRender: (text, record) => {
            if (record.type === 'Role_Group') return record.roleGroup && record.roleGroup.name || this.roleGroupListState[record.roleId] || ''
            else return this.roleListState[record.roleId]
          }
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          customRender: (text) => this.orgRoleType[text]
        },
        {
          title: '组织',
          align: 'center',
          dataIndex: 'orgId',
          customRender: (text) => this.orgListState[text]
        },
        {
          title: '应用',
          align: 'center',
          dataIndex: 'app.name',
          customRender: (text, record) => text || this.appListState[record.appId]
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
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'id',
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getOrgRoleList({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  computed: mapGetters(['resCodes', 'orgRoleType', 'orgListState', 'appId', 'appListState', 'roleGroupListState', 'roleListState', 'microOrgListStateOptions', ...storeState, ...listState]),
  created () {
    this.$bus.$on('updateOrgRoleList', () => {
      this.$refs.table.refresh()
    })
    listState.forEach(el => {
      !this[el].length && this.$store.dispatch('GetListState', el.slice(0, -7))
    })
    storeState.forEach(el => {
      if (el.includes('Options')) {
        !this[el].length && this.$store.dispatch('GetEnum', [this.resCodes[el.slice(0, -7)], el.slice(0, -7)])
      } else {
        !Object.keys(this[el]).length && this.$store.dispatch('GetEnum', [this.resCodes[el], el])
      }
    })
  },
  methods: {
    statusChange (record) {
      record.status = record.status === 'Enable' ? 'Disable' : 'Enable'
      this.$put('/orgRole/modify', record, r => {
        if (r) {
          this.$refs.table.refresh()
        } else { record.status = record.status === 'Enable' ? 'Disable' : 'Enable' }
      })
    },
    appChange (val) {
      this.isSelectedApp = true
      Reflect.deleteProperty(this.queryParam, 'orgId')
      this.initOrgListStateOptions = this.orgListStateOptions.filter(el => el.appId === val)
    }
  }
}
</script>
<style scoped>
</style>
