<template>
  <div class="roleGroup">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item v-if="!appId">
          <a-select v-model="queryParam.appId" style="width:150px;" placeholder="请选择应用">
            <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.name" placeholder="角色组名"/>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.status" style="width:150px;" placeholder="请选择状态">
            <a-select-option v-for="item in roleGroupStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('roleGroup.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => queryParam = {}">重置</a-button>
          <a-button type="primary" @click="$globalOpendialog(vue_compent)" v-if="$auth('roleGroup.build')">新增</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #status="text">
          <span :class="{ 'danger': text === 'Disable', 'success': text === 'Enable' }">{{ roleGroupStatus[text] }}</span>
        </template>
        <template #action="text, record">
          <span>
            <template>
              <a-button type="primary" @click="$globalOpendialog(vue_compent, record)" v-if="$auth('roleGroup.modify')">编辑</a-button>
              <a-button @click="$refs.deployModal.open(record)" type="primary" style="margin: 0 10px;" v-if="$auth('roleGroupRelationList.build')">配置角色</a-button>
              <a-button type="danger" @click="$globalHandlerDelete('/roleGroup/delete', { id: text, appId: record.appId }, $refs.table.refresh)" v-if="$auth('roleGroup.delete')">删除</a-button>
            </template>
          </span>
        </template>
      </s-table>
      <deploy-modal ref="deployModal" @refresh="$refs.table.refresh()"></deploy-modal>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getRoleGroupList } from '@/api/role'
import { mapGetters } from 'vuex'
import AddModal from './AddModal'
import DeployModal from './DeployModal'
const listState = ['appListStateOptions', 'roleGroupRelationListStateOptions']
const storeState = ['roleGroupStatusOptions', 'roleType', 'roleStatus']
export default {
  name: 'RoleGroup',
  components: { STable, AddModal, DeployModal },
  data () {
    return {
      queryParam: {},
      vue_compent: this,
      columns: [
        {
          title: '应用',
          align: 'center',
          dataIndex: 'appId',
          customRender: (text) => this.appListState[text]
        },
        {
          title: '角色组名',
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
        return getRoleGroupList({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  computed: mapGetters(['resCodes', 'roleGroupStatus', 'appListState', 'appId', ...storeState, ...listState]),
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
