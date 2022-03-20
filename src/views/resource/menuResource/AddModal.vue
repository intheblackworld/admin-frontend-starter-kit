<template>
  <a-form :form="form">
    <a-form-item label="菜单标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['title', { rules: $validator('请输入菜单标题') }]"/>
    </a-form-item>
    <a-form-item label="组件name" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['name', { rules: $validator('请输入组件名') }]"/>
    </a-form-item>
    <a-form-item label="页面url" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['path', { rules: $validator('请输入路径') }]"/>
    </a-form-item>
    <a-form-item label="组件重定向" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="menuId === '-1'">
      <a-input v-decorator="['redirect']"/>
    </a-form-item>
    <a-form-item label="组件图标" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="menuId === '-1'">
      <a-input v-decorator="['icon', { rules: [{required: true, message: '请选择图标'} ]} ]" style="width: 70%" disabled/>
      <a-button type="primary" @click="selectIcon">选择图标</a-button>
    </a-form-item>
    <a-form-item label="显示菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['show']" placeholder="请选择">
        <a-select-option v-for="item in yNEnumOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="缓存组件" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="menuId !== '-1'">
      <a-select v-decorator="['keepAlive', { rules: [{required: true, message: '请选择是否缓存'} ]} ]" placeholder="请选择">
        <a-select-option v-for="item in yNEnumOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="false">
      <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择">
        <a-select-option v-for="item in menuResourceStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="层级" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input-number
        v-decorator="['level',{rules: $validator('请输入层级')}]"
        :min="1"
        :max="999"
        :formatter="value => parseInt(value) ? parseInt(value) : ''"
        placeholder="请输入层级"
        style="width: 100%;"/>
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
  </a-form>
</template>

<script>
import IconModal from './IconModal'
import { mapGetters } from 'vuex'
export default {
  props: {
    menuId: {
      type: String,
      default: ''
    },
    appId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      form: this.$form.createForm(this)
    }
  },
  computed: mapGetters(['menuResourceStatusOptions', 'yNEnumOptions']),
  mounted () {
    if (this.menuId === '-1') {
      this.form.setFieldsValue({ show: 'Y', status: 'Enable', level: 1 })
    } else this.form.setFieldsValue({ show: 'Y', keepAlive: 'Y', status: 'Enable', level: 2 })
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        const { form: { validateFields }, menuId, appId } = this
        validateFields((errors, values) => {
          if (!errors) {
            if (this.menuId === '-1') values.type = 'Node'
            else values.type = 'Leaf'
            this.$post('/menuResource/build', { appId, preId: menuId, ...values }, res => {
              res && resolve(true)
            })
          }
        })
      })
    },
    selectIcon () {
      this.$dialog(IconModal,
        {
          cb: (res) => {
            this.form.setFieldsValue({ icon: res })
          },
          on: {
            ok: () => {}
          }
        },
        {
          title: '选择图标',
          width: 800
        }
      )
    }
  }
}
</script>

<style scoped>
</style>
