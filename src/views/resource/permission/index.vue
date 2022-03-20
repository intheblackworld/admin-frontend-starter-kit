<template>
  <div class="peimission">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item v-if="!appId">
          <a-select v-model="queryParam.appId" style="width:150px;" placeholder="请选择应用">
            <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.name" placeholder="权限名"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.code" placeholder="权限码"/>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.status" style="width:150px;" placeholder="请选择状态">
            <a-select-option v-for="item in roleStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('permission.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => queryParam = {}">重置</a-button>
          <a-button type="primary" @click="permission" v-if="$auth('permissionList.build')">批量配置资源</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #status="text">
          <span :class="{ 'danger': text === 'Disable', 'success': text === 'Enable' }">{{ roleStatus[text] }}</span>
        </template>
        <template #action="text, record">
          <span>
            <template>
              <a-button type="primary" @click="$globalOpendialog(vue_compent, record)" v-if="$auth('permission.modify')">编辑</a-button>
              <!-- <a-button @click="permission(record)" type="primary">配置权限</a-button> -->
              <!-- <a-button type="danger" @click="$globalHandlerDelete('/role/delete', { id: text, appId: record.appId }, $refs.table.refresh)">删除</a-button> -->
            </template>
          </span>
        </template>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getPermissions } from '@/api/resource'
import { mapGetters } from 'vuex'
import AddModal from './AddModal'
import Permission from './Permission'
const listState = ['appListStateOptions']
const storeState = ['roleStatusOptions', 'menuResourceType']
export default {
  name: 'Peimission',
  components: { STable, AddModal },
  data () {
    return {
      queryParam: {},
      vue_compent: this,
      columns: [
        {
          title: '系统',
          align: 'center',
          dataIndex: 'app.name'
        },
        {
          title: '权限名',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '权限码',
          align: 'center',
          dataIndex: 'code'
        },
        {
          title: '类型',
          align: 'center',
          dataIndex: 'type',
          customRender: (text) => this.menuResourceType[text]
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
        return getPermissions({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  methods: {
    permission () {
      this.$dialog(Permission,
        {
          record: {},
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        },
        {
          title: '批量配置资源',
          width: 800
        }
      )
    }
  },
  computed: mapGetters(['resCodes', 'roleStatus', 'appId', ...storeState, ...listState]),
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
