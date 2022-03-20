<template>
  <a-form :form="form">
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
  </a-form>
</template>

<script>
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
  computed: mapGetters(['menuResourceStatusOptions']),
  mounted () {
    this.form.setFieldsValue({ status: 'Enable' })
  },
  methods: {
    onOk () {
      return new Promise(resolve => {
        const { form: { validateFields }, menuId, appId } = this
        validateFields((errors, values) => {
          if (!errors) {
            this.$post('/optResource/build', { appId, menuId, type: 'Opt', ...values }, res => {
              res && resolve(true)
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
