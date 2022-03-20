<template>
  <div class="app">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item v-if="!appId">
          <a-select v-model="queryParam.appId" style="width:150px;" placeholder="请选择应用">
            <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('online.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => queryParam = {}">重置</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #action="text">
          <span>
            <template>
              <a-button type="primary" @click="kickout(text)" v-if="$auth('user.kickout')">踢出会话</a-button>
            </template>
          </span>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOnlineList } from '@/api/dashboard'
import { mapGetters } from 'vuex'
const listState = ['appListStateOptions']
export default {
  name: 'Online',
  components: { STable },
  data () {
    return {
      queryParam: {},
      columns: [
        {
          title: '应用',
          align: 'center',
          dataIndex: 'app.name',
          customRender: (text, record) => text || this.appListState[record.appId]
        },
        {
          title: '用户/账号',
          align: 'center',
          dataIndex: 'name',
          customRender: (text, record) => `${text}/${record.account}`
        },
        {
          title: 'IP',
          align: 'center',
          dataIndex: 'ip'
        },
        {
          title: '浏览器信息',
          align: 'center',
          dataIndex: 'ua'
        },
        {
          title: '在线时长',
          align: 'center',
          dataIndex: 'loginDuration',
          customRender: (text) => `${text}分钟`
        },
        {
          title: '登录时间',
          align: 'center',
          dataIndex: 'loginTime',
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
        return getOnlineList({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  methods: {
    kickout (userId) {
      this.$http.get('/kickout', { params: { userId } })
    }
  },
  computed: mapGetters(['appId', 'appListState', ...listState]),
  created () {
    listState.forEach(el => {
      !this[el].length && this.$store.dispatch('GetListState', el.slice(0, -7))
    })
  }
}
</script>
<style scoped>
</style>
