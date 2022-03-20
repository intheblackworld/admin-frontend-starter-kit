<template>
  <div class="permission">
    <a-card :bordered="false">
      <a-form layout="inline" style="margin-bottom:20px;">
        <a-form-item label="应用" v-if="!initAppId">
          <a-select style="width:250px;" placeholder="请选择应用" @change="appChange">
            <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="">
          <a-button type="primary" @click="handleAdd('catalog')" icon="plus" v-if="$auth('menuResourceRoot.build')">添加顶部菜单</a-button>
          <a-button type="primary" @click="handleAdd('childNode')" icon="plus" style="margin: 0 30px;" v-if="$auth('menuResource.build')">添加子节点</a-button>
          <a-button type="primary" @click="handleOpt" icon="plus" v-if="$auth('optResource.build')">添加操作</a-button>
        </a-form-item>
      </a-form>
      <a-row>
        <a-col :span="6">
          <a-tree
            class="draggable-tree"
            draggable
            @drop="onDrop"
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            :replaceFields="replaceFields"
            :selectedKeys="selectedKeys"
            :treeData="treeMenus"
            @select="onSelect"
          />
        </a-col>
        <a-col :span="2"></a-col>
        <a-col :span="13">
          <a-form :form="form" v-show="activeData.id && !activeData.menuId">
            <a-form-item label="菜单标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['title', { rules: $validator('请输入菜单标题') }]"/>
            </a-form-item>
            <a-form-item label="组件name" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['name', { rules: $validator('请输入组件名') }]"/>
            </a-form-item>
            <a-form-item label="页面url" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['path',{ rules: $validator('请输入路径') }]"/>
            </a-form-item>
            <a-form-item label="组件重定向" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="activeData.preId === '-1'">
              <a-input v-decorator="['redirect']"/>
            </a-form-item>
            <a-form-item label="组件图标" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="activeData.preId === '-1'">
              <a-input v-decorator="['icon']" style="width: 60%" disabled/>
              <a-icon :type="logo" :style="{ fontSize: '28px', margin: '0 20px' }" v-if="logo"></a-icon>
              <a-button type="primary" @click="() => { showEditicon = true }">选择图标</a-button>
            </a-form-item>
            <a-form-item label="显示菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-select v-decorator="['show']" placeholder="请选择">
                <a-select-option v-for="item in yNEnumOptions" :key="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="缓存组件" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="activeData.preId !== '-1'">
              <a-select v-decorator="['keepAlive', { rules: [{ required: true, message: '请选择是否缓存'} ]} ]" placeholder="请选择">
                <a-select-option v-for="item in yNEnumOptions" :key="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
              <a-select v-decorator="['status', { rules: [{ required: true, message: '请选择状态'} ]} ]" placeholder="请选择">
                <a-select-option v-for="item in menuResourceStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="层级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                v-decorator="['level', { rules: $validator('请输入层级') }]"
                :min="1"
                :max="999"
                :formatter="value => parseInt(value) ? parseInt(value) : ''"
                placeholder="请输入层级"
                style="width: 100%;"/>
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                v-decorator="['sort', { rules: $validator('请输入排序编号') }]"
                :min="1"
                :max="999"
                :formatter="value => parseInt(value) ? parseInt(value) : ''"
                placeholder="请输入排序编号"
                style="width: 100%;"/>
            </a-form-item>
            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-top: 60px;">
              <a-button type="primary" @click="eddit" style="margin-left: 30%; width: 150px;" size="large" v-if="$auth('menuResource.modify')">保存</a-button>
              <a-button type="danger" style="margin-left: 50px; width: 150px;" @click="remove" size="large" v-if="$auth('menuResource.delete')">删除</a-button>
            </a-form-item>
          </a-form>
          <a-form :form="optForm" v-show="activeData.id && activeData.menuId">
            <a-form-item label="操作名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['title', { rules: $validator('请输入操作名') }]"/>
            </a-form-item>
            <a-form-item label="按钮权限码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['code', { rules: $validator('请输入按钮权限码') } ]"/>
            </a-form-item>
            <a-form-item label="uri" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['uri', { rules: $validator('请输入uri') } ]"/>
            </a-form-item>
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
              <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择">
                <a-select-option v-for="item in menuResourceStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                v-decorator="['sort',{rules: $validator('请输入排序编号')}]"
                :min="1"
                :max="999"
                :formatter="value => parseInt(value) ? parseInt(value) : ''"
                placeholder="请输入排序编号"
                style="width: 100%;"/>
            </a-form-item>
            <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-top: 60px;">
              <a-button type="primary" @click="optEddit" style="margin-left: 30%; width: 150px;" size="large" v-if="$auth('optResource.modify')">保存</a-button>
              <a-button type="danger" style="margin-left: 50px; width: 150px;" @click="remove" size="large" v-if="$auth('optResource.delete')">删除</a-button>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      <a-modal v-model="showEditicon" @ok="() => showEditicon = false" :width="800" title="选择图标">
        <div class="menu-content">
          <div v-for="v in icons" :key="v.key" class="menu-icon">
            <span>{{ v.title }}:</span>
            <ul class="icon-list">
              <li v-for="(icon, key) in v.icons" :key="key" @click="chooseIcon(icon)">
                <a-icon :type="icon" :style="{ fontSize: '36px' }" />
                <a-icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" v-show="icon === logo" class="choose"/>
              </li>
            </ul>
          </div>
        </div>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
import icons from '@/components/IconSelector/icons.js'
import { getMenuResourceList } from '@/api/resource'
import { listToTree, tree2list } from '@/utils/util'
import { confirmDel } from '@/api'
import AddModal from './AddModal'
import Optmodal from './OptModal'
const nodeFields = ['title', 'name', 'path', 'status', 'level', 'sort', 'show', 'redirect', 'icon']
const leafFields = ['title', 'name', 'path', 'status', 'level', 'sort', 'show', 'keepAlive']
const optFields = ['title', 'code', 'status', 'sort', 'uri']
const listState = ['appListStateOptions']
const storeState = ['menuResourceStatusOptions', 'menuResourceTypeOptions', 'yNEnumOptions']
export default {
  name: 'Permission',
  data () {
    return {
      appId: '',
      logo: '',
      expandedKeys: [],
      autoExpandParent: true,
      replaceFields: {
        children: 'optList',
        title: 'title',
        key: 'id'
      },
      selectedKeys: [],
      treeMenus: [],
      list: [],
      activeData: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      form: this.$form.createForm(this, { name: 'menu' }),
      optForm: this.$form.createForm(this, { name: 'opt' }),
      icons,
      showEditicon: false,
      menuUrlList: [],
      menuSourceData: []
    }
  },
  methods: {
    add (menuId, title) {
      this.$dialog(AddModal,
        {
          menuId,
          appId: this.appId,
          on: {
            ok: () => {
              this.initTreeMenu(this.appId)
            }
          }
        },
        {
          title,
          width: 700,
          dialogStyle: { top: '60px' }
        }
      )
    },
    opt (menuId) {
      this.$dialog(Optmodal,
        {
          menuId,
          appId: this.appId,
          on: {
            ok: () => {
              this.initTreeMenu(this.appId)
            }
          }
        },
        {
          title: `添加【${this.activeData.title}】下的操作`
        }
      )
    },
    handleAdd (type) {
      if (this.appId) {
        if (type === 'childNode') {
          if (this.selectedKeys.length) {
            this.add(this.selectedKeys.join(), `添加【${this.activeData.title}】下的子节点`)
          } else this.$notification.error({ message: '请先选择父节点！' })
        } else {
          this.add('-1', '添加顶部菜单')
        }
      } else this.$notification.error({ message: '请先选择应用' })
    },
    handleOpt () {
      if (this.appId) {
        if (this.selectedKeys.length) {
          this.opt(this.selectedKeys.join())
        } else this.$notification.error({ message: '请先选择菜单！' })
      } else this.$notification.error({ message: '请先选择应用' })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect (selectedKeys) {
      this.selectedKeys = selectedKeys
      if (selectedKeys.length) {
        this.activeData = this.list.find(el => el.id === selectedKeys.join())
        if (this.activeData.menuId) {
          this.optForm.setFieldsValue(pick(this.activeData, optFields))
        } else {
          if (this.activeData.preId === '-1') {
            this.logo = this.activeData.icon
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.activeData, nodeFields))
            })
          } else {
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.activeData, leafFields))
            })
          }
        }
      }
    },
    chooseIcon (val) {
      this.logo = val
      this.form.setFieldsValue({ 'icon': val })
    },
    eddit () {
      const { appId, form: { validateFields }, activeData: { preId, id, path, type } } = this
      validateFields((errors, values) => {
        if (!errors) {
          if (this.menuUrlList.includes(values.path) && values.path !== path) {
            this.$notification.error({ message: '链接已存在！ ' })
          } else {
            this.$put('/menuResource/modify', { appId, preId, id, type, ...values }, res => {
              res && this.initTreeMenu(appId)
            })
          }
        }
      })
    },
    optEddit () {
      const { appId, optForm: { validateFields }, activeData: { menuId, id } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.$put('/optResource/modify', { appId, menuId, id, type: 'Opt', ...values }, res => {
            res && this.initTreeMenu(appId)
          })
        }
      })
    },
    remove () {
      const { activeData: { id, menuId } } = this
      const url = menuId && '/optResource/delete' || '/menuResource/delete'
      confirmDel('确定删除当前数据吗？', url, { appId: this.appId, id }, res => {
        if (res) {
          this.activeData = {}
          this.initTreeMenu(this.appId)
        }
      })
    },
    async initTreeMenu (appId) {
      const { data } = await getMenuResourceList({ appId, curPage: 1, pageSize: -1 })
      this.menuSourceData = data.records
      this.menuUrlList = data.records.filter(el => el.path).map(item => item.path)
      this.treeMenus = listToTree(data.records, '-1', 'optList')
      this.list = tree2list(this.treeMenus)
    },
    appChange (value) {
      this.appId = value
      this.activeData = {}
      this.selectedKeys = []
      this.initTreeMenu(value)
    },
    onDrop (info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const dropData = this.menuSourceData.find(el => el.id === dropKey)
      const dragData = this.menuSourceData.find(el => el.id === dragKey)
      if (!dropData || !dragData) {
        this.$notification.error({ message: '只支持菜单拖拽,并拖菜单下!!!' })
        return
      }
      let newPreId
      if (dropPosition === 0) {
        newPreId = dropKey
      } else {
        if (dragData.preId === dropData.preId) {
          this.$notification.warning({ message: '同级别拖拽请修改排序！' })
          return
        }
        newPreId = dropData.preId
      }
      this.$http.put('/menuResource/modifyDad', null, {
        params: {
          id: dragKey,
          newPreId
        }
      }).then(res => {
        const { code, msg } = res
        if (code === '0000') {
          this.$notification.success({ message: msg })
          this.initTreeMenu(this.appId)
        } else this.$notification.error({ message: msg })
      })
    }
  },
  computed: mapGetters(['resCodes', 'initAppId', ...storeState, ...listState]),
  created () {
    // this.initTreeMenu()
    if (this.initAppId) {
      this.appChange(this.initAppId)
    }
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
<style scoped lang="less">
.menu-content{
  height: 300px;
  overflow-y:scroll ;
  .menu-icon{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .icon-list{
      display: flex;
      width: 80%;
      flex-wrap: wrap;
      cursor: pointer;
      li{
        margin: 4px;
        position: relative
      }
      .choose{
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
