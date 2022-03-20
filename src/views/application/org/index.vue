<template>
  <div class="org">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item>
          <a-input v-model="queryParam.name" placeholder="组织名称"/>
        </a-form-item>
        <a-form-item v-if="!appId">
          <a-select v-model="queryParam.appId" style="width:150px;" placeholder="请选择应用">
            <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.status" style="width:150px;" placeholder="请选择">
            <a-select-option v-for="item in orgStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('org.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => queryParam = {}">重置</a-button>
          <a-button type="primary" @click="$globalOpendialog(vue_compent, {})" v-if="$auth('org.build')">新增</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #status="text">
          <span :class="{ 'danger': text === 'Disable', 'success': text === 'Enable' }">{{ orgStatus[text] }}</span>
        </template>
        <template #action="text, record">
          <span>
            <template>
              <a-button type="primary" @click="$globalOpendialog(vue_compent, record)" v-if="$auth('org.modify')">编辑</a-button>
              <!-- <a-button type="danger" @click="$globalHandlerDelete('/org/delete', { id:text }, $refs.table.refresh, 'orgListState')">删除</a-button> -->
              <a-button type="primary" @click="$refs.roleModal.open(record, 'Role')" style="margin: 0 10px;" v-if="$auth('orgRole.build')">配置角色</a-button>
              <a-button type="primary" @click="$refs.roleGroup.open(record, 'Role_Group')" v-if="$auth('orgRoleGroup.build')">配置角色组</a-button>
            </template>
          </span>
        </template>
      </s-table>
      <role-modal ref="roleModal"></role-modal>
      <role-group ref="roleGroup"></role-group>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOrgList } from '@/api/app'
import { mapGetters } from 'vuex'
import AddModal from './AddModal'
import RoleModal from './RoleModal'
import RoleGroup from './RoleGroup'
const listState = ['orgListStateOptions', 'appListStateOptions', 'orgRoleListStateOptions']
const storeState = ['orgStatusOptions', 'appSessionType', 'roleType', 'roleStatus']
export default {
  name: 'Org',
  components: { STable, AddModal, RoleModal, RoleGroup },
  data () {
    return {
      queryParam: {},
      vue_compent: this,
      columns: [
        {
          title: '组织名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '上级',
          align: 'center',
          dataIndex: 'preId',
          customRender: (text) => text && this.orgListState[text] || ''
        },
        {
          title: '应用',
          align: 'center',
          dataIndex: 'app.name'
        },
        {
          title: '会话时长',
          align: 'center',
          dataIndex: 'sessionType',
          customRender: (text) => this.appSessionType[text]
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '备注',
          align: 'center',
          width: 200,
          dataIndex: 'summary'
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
        return getOrgList({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  computed: mapGetters(['resCodes', 'orgStatus', 'orgListState', 'appId', ...storeState, ...listState]),
  created () {
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
  }
}
</script>
<style scoped>
</style>
