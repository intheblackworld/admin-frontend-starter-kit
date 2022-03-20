<template>
  <div class="loginLog">
    <a-card :bordered="false" class="costomTable">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item v-if="!appId">
          <a-select v-model="queryParam.appId" style="width:150px;" placeholder="请选择应用">
            <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.account" placeholder="用户账号"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.ip" placeholder="ip"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('loginLog.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => queryParam = {}">重置</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getLoginLog } from '@/api/log'
import { mapGetters } from 'vuex'
const listState = ['appListStateOptions']
export default {
  name: 'LoginLog',
  components: { STable },
  data () {
    return {
      queryParam: {},
      columns: [
        {
          title: '应用',
          align: 'center',
          dataIndex: 'appName',
          customRender: (text, record) => text || this.appListState[record.appId]
        },
        {
          title: '用户',
          align: 'center',
          dataIndex: 'account'
        },
        {
          title: '组织',
          align: 'center',
          dataIndex: 'orgName'
        },
        {
          title: '域名',
          align: 'center',
          dataIndex: 'appDomain',
          customRender: (text) => <a href={`http://${text}`} target='_blank'>{text}</a>
        },
        {
          title: 'ip',
          align: 'center',
          width: 200,
          dataIndex: 'ip'
        },
        {
          title: '浏览器信息',
          align: 'center',
          dataIndex: 'ua',
          width: 300,
          customRender: (text) => <a-popover title={text}><div class='ellipsis'>{text}</div></a-popover>
        },
        {
          title: '登录时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: (text) => this.$toLocalTime(text)
        }
      ],
      loadData: parameter => {
        return getLoginLog({ ...parameter, ...this.queryParam }).then(res => res)
      }
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
