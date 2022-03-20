<template>
  <div class="operateLog">
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
          <a-input v-model="queryParam.uri" placeholder="uri"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.ip" placeholder="ip"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('optLog.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => queryParam = {}">重置</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #app>
          <span>
            <div><span>应用</span></div>
            <div><span>域名</span></div>
          </span>
        </template>
        <template #user>
          <span>
            <div><span>用户</span></div>
            <div><span>组织</span></div>
            <div><span>ip</span></div>
          </span>
        </template>
        <template #api>
          <span>
            <div><span>接口</span></div>
            <div><span>uri</span></div>
          </span>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getOperateLog } from '@/api/log'
import { mapGetters } from 'vuex'
const listState = ['appListStateOptions']
export default {
  name: 'OperateLog',
  components: { STable },
  data () {
    return {
      queryParam: {},
      columns: [
        {
          slots: { title: 'app' },
          align: 'center',
          dataIndex: 'appName',
          customRender: (text, record) => (
            <div>
              <div><span>{text || this.appListState[record.appId]}</span></div>
              <a href={`http://${record.appDomain}`} target='_blank'>{record.appDomain}</a>
            </div>
          )
        },
        {
          slots: { title: 'user' },
          align: 'center',
          dataIndex: 'account',
          customRender: (text, record) => (
            <div>
              <div><span>{text}</span></div>
              <div><span>{record.orgName}</span></div>
              <div><span>{record.ip}</span></div>
            </div>
          )
        },
        {
          slots: { title: 'api' },
          align: 'center',
          dataIndex: 'apiNotes',
          customRender: (text, record) => (
            <div>
              <div><span>{text}</span></div>
              <div><span>{record.uri}</span></div>
            </div>
          )
        },
        {
          title: '请求参数',
          align: 'center',
          width: 300,
          dataIndex: 'requestParam',
          customRender: (text) => <a-popover title={text}><div class='ellipsis'>{text}</div></a-popover>
        },
        {
          title: '响应结果',
          align: 'center',
          width: 300,
          dataIndex: 'responseData',
          customRender: (text) => <a-popover title={text}><div class='ellipsis'>{text}</div></a-popover>
        },
        {
          title: '操作时间',
          align: 'center',
          dataIndex: 'createTime',
          customRender: (text) => this.$toLocalTime(text)
        }
      ],
      loadData: parameter => {
        return getOperateLog({ ...parameter, ...this.queryParam }).then(res => res)
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
