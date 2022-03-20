<template>
  <div class="user">
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
          <a-input v-model="queryParam.account" placeholder="账号"/>
        </a-form-item>
        <a-form-item>
          <a-input v-model="queryParam.name" placeholder="姓名"/>
        </a-form-item>
        <a-form-item>
          <a-select v-model="queryParam.status" style="width:150px;" placeholder="请选择状态">
            <a-select-option v-for="item in userStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="$refs.table.refresh(true)" v-if="$auth('rbacUser.list')">查询</a-button>
          <a-button style="margin:0 20px;" @click="() => { queryParam = {}, this.isSelectedApp = false }">重置</a-button>
          <a-button type="primary" @click="$globalOpendialog(vue_compent, {}, { width: 800, dialogStyle: { top: '60px' } })" v-if="$auth('rbacUser.build')">新增</a-button>
        </a-form-item>
      </a-form>
      <s-table
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData">
        <template #status="text">
          <span :class="{ 'danger': text === 'Disable', 'success': text === 'Enable' }">{{ userStatus[text] }}</span>
        </template>
        <template #avatar="text">
          <img :src="text" style="width: 30px;" />
        </template>
        <template #action="text, record">
          <span>
            <template>
              <a-button type="primary" style="margin-right: 10px;" @click="$globalOpendialog(vue_compent, record, { width: 800, dialogStyle: { top: '60px' } })" v-if="$auth('rbacUser.modify')">编辑</a-button>
              <a-button type="primary" style="margin-right: 10px;" @click="reset(record)" v-if="$auth('rbac.resetGoogleCode')">重置口令</a-button>
              <!-- <a-button type="danger" @click="$globalHandlerDelete('/rbacUser/delete', { id:text }, $refs.table.refresh, 'userListState')">删除</a-button> -->
              <a-button type="primary" @click="$refs.roleModal.open(record)" v-if="$auth('userRole.build')">配置角色</a-button>
              <!-- <a-button type="primary" @click="kickout(text)" v-if="$auth('user.kickout')">踢出会话</a-button> -->
            </template>
          </span>
        </template>
      </s-table>
      <role-modal ref="roleModal"></role-modal>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getUserList } from '@/api/app'
import { mapGetters } from 'vuex'
import AddModal from './AddModal'
import RoleModal from './RoleModal'
const listState = ['orgListStateOptions', 'appListStateOptions', 'userListStateOptions', 'roleGroupListStateOptions', 'roleListStateOptions', 'userRoleListStateOptions', 'orgRoleListStateOptions']
const storeState = ['userStatusOptions', 'appSessionType', 'orgRoleStatusOptions', 'orgRoleType', 'roleType']
export default {
  name: 'User',
  components: { STable, AddModal, RoleModal },
  data () {
    return {
      queryParam: {},
      vue_compent: this,
      isSelectedApp: false,
      initOrgListStateOptions: [],
      columns: [
        {
          title: '账号',
          align: 'center',
          dataIndex: 'account'
        },
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name'
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
          title: '头像',
          align: 'center',
          dataIndex: 'avatar',
          scopedSlots: { customRender: 'avatar' }
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
        return getUserList({ ...parameter, ...this.queryParam }).then(res => res)
      }
    }
  },
  computed: mapGetters(['resCodes', 'userStatus', 'orgListState', 'appId', 'appListState', 'microOrgListStateOptions', ...storeState, ...listState]),
  methods: {
    kickout (userId) {
      this.$http.get('/kickout', { params: { userId } })
    },
    reset ({ account, id }) {
      this.$confirm({
        title: '提示',
        content: `确定重置 ${account} 谷歌口令吗`,
        onOk: () => {
          this.$put('/rbacUser/resetGoogleCode', { id })
        }
      })
    },
    appChange (val) {
      this.isSelectedApp = true
      Reflect.deleteProperty(this.queryParam, 'orgId')
      this.initOrgListStateOptions = this.orgListStateOptions.filter(el => el.appId === val)
    }
  },
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
