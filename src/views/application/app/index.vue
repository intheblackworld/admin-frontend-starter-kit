<template>
  <div class="app">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item v-if="!appId">
          <a-input v-model="queryParam.name" placeholder="应用名称"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.appCode" placeholder="应用编码"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.appDomain" placeholder="域名"/>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.status" style="width:150px;" placeholder="请选择状态">
            <a-select-option v-for="item in appStateOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('app.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => queryParam = {}">重置</a-button>
          <a-button type="primary" @click="$globalOpendialog(vue_compent, {}, { width: 800, dialogStyle: { top: '10px' } })" v-if="$auth('app.build')">新增</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #status="text">
          <span :class="{ 'danger': text === 'Disable', 'success': text === 'Enable' }">{{ appState[text] }}</span>
        </template>
        <template #logo="text">
          <img :src="text" style="width: 30px;" />
        </template>
        <template #action="text, record">
          <span>
            <template>
              <a-button type="primary" @click="$globalOpendialog(vue_compent, Object.assign(record, { isCopy : false }), { width: 800, dialogStyle: { top: '60px' } })" v-if="$auth('app.modify')">编辑</a-button>
              <!-- <a-button type="primary" @click="$globalOpendialog(vue_compent, Object.assign(record, { isCopy : true }), { width: 800, dialogStyle: { top: '60px' }, title: '复制应用' })" v-if="$auth('app.copy')" style="margin-left: 10px;">复制</a-button> -->
            </template>
          </span>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getAppList } from '@/api/app'
import { mapGetters } from 'vuex'
import AddModal from './AddModal'
const storeState = ['appStateOptions', 'appSessionTypeOptions', 'jwtTypeOptions']
const listState = ['appListStateOptions']
export default {
  name: 'App',
  components: { STable, AddModal },
  data () {
    return {
      queryParam: {},
      vue_compent: this,
      columns: [
        {
          title: '应用',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '编码',
          align: 'center',
          dataIndex: 'appCode'
        },
        {
          title: '域名',
          align: 'center',
          dataIndex: 'appDomain',
          customRender: (text) => <a href={`http://${text}`} target='_blank'>{text}</a>
        },
        {
          title: '会话时长',
          align: 'center',
          dataIndex: 'sessionType',
          width: 100,
          customRender: (text) => this.appSessionType[text]
        },
        {
          title: 'ip白名单',
          align: 'center',
          width: 300,
          dataIndex: 'appIp.ip'
        },
        {
          title: '状态',
          align: 'center',
          width: 80,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: 'logo',
          align: 'center',
          dataIndex: 'logo',
          scopedSlots: { customRender: 'logo' }
        },
        {
          title: '备注',
          align: 'center',
          width: 150,
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
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getAppList({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  computed: mapGetters(['resCodes', 'appState', 'appSessionType', 'appId', ...storeState, ...listState]),
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
