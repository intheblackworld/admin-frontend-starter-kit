<template>
  <div class="role">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item>
          <a-input v-model="queryParam.routeId" placeholder="路由ID"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.uri" placeholder="url路径"/>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.status" style="width:150px;" placeholder="请选择状态">
            <a-select-option v-for="item in yNEnumOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('gatewayRoute.list')">查询</a-button>
          <a-button style="margin:0 10px;" @click="() => queryParam = {}">重置</a-button>
          <a-button type="primary" @click="$globalOpendialog(vue_compent, {}, { width: 600 })" v-if="$auth('gatewayRoute.build')">新增</a-button>
          <a-button type="primary" style="margin-left: 10px;" @click="$put('/gatewayRoute/updateCacheGatewayRoute')" v-if="$auth('gatewayRoute.update')">更新缓存</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #action="text, record">
          <span>
            <template>
              <a-button type="primary" style="margin-right: 10px;" @click="$globalOpendialog(vue_compent, record, { width: 600 })" v-if="$auth('gatewayRoute.modify')">编辑</a-button>
              <a-button type="danger" @click="$globalHandlerDelete('/gatewayRoute/delete', { id: text, appId: record.appId }, $refs.table.refresh, '', 'query')" v-if="$auth('gatewayRoute.delete')">删除</a-button>
            </template>
          </span>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getRouteList } from '@/api/gatewayRoute'
import { mapGetters } from 'vuex'
import AddModal from './AddModal'
const storeState = ['yNEnumOptions']
export default {
  name: 'GatewayRoute',
  components: { STable, AddModal },
  data () {
    return {
      queryParam: {},
      vue_compent: this,
      columns: [
        {
          title: '路由ID',
          align: 'center',
          dataIndex: 'routeId'
        },
        {
          title: 'url路径',
          align: 'center',
          width: 200,
          dataIndex: 'uri'
        },
        {
          title: '判定器',
          align: 'center',
          width: 250,
          dataIndex: 'predicates'
        },
        {
          title: '过滤器',
          align: 'center',
          width: 250,
          dataIndex: 'filters'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'orders'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          customRender: (text) => <span class={text === 'Y' && 'success' || 'danger'}>{this.yNEnum[text] || text}</span>
        },
        {
          title: '路由描述',
          align: 'center',
          width: 100,
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: (text) => this.$toLocalTime(text)
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime',
          customRender: (text) => this.$toLocalTime(text)
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'id',
          width: 200,
          scopedSlots: { customRender: 'action' }
        }
      ],
      loadData: parameter => {
        return getRouteList({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  computed: mapGetters(['resCodes', 'yNEnum', ...storeState]),
  created () {
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
