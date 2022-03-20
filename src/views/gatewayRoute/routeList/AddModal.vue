<template>
  <a-form :form="form">
    <a-form-item label="路由ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['routeId', { rules: [{required: true, message: '请输入路由ID'} ]}]" placeholder="请输入路由ID"/>
    </a-form-item>
    <a-form-item label="url路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['uri', { rules: [{required: true, message: '请输入url路径'}, { pattern: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/, message: '请正确输入url路径' } ]}]" placeholder="请输入url路径"/>
    </a-form-item>
    <a-form-item label="判定器" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-textarea :auto-size="{ minRows: 2 }" v-decorator="['predicates', { rules: [{required: true, message: '请输入判定器'} ]}]" placeholder="请输入判定器"/>
    </a-form-item>
    <a-form-item label="过滤器" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-textarea :auto-size="{ minRows: 2 }" v-decorator="['filters', { rules: [{required: true, message: '请输入过滤器'} ]}]" placeholder="请输入过滤器"/>
    </a-form-item>
    <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择状态">
        <a-select-option v-for="item in yNEnumOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input-number
        v-decorator="['orders']"
        :min="1"
        :max="999"
        :formatter="value => parseInt(value) ? parseInt(value) : ''"
        placeholder="请输入排序编号"
        style="width: 100%;"/>
    </a-form-item>
    <a-form-item label="路由描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-textarea :auto-size="{ minRows: 2 }" v-decorator="['description', { rules: $validatorO.summary() }]" placeholder="多行输入"/>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
const fields = ['routeId', 'uri', 'predicates', 'filters', 'status', 'description']
export default {
  props: {
    record: {
      type: Object,
      default: null
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
      form: this.$form.createForm(this),
      requestData: { url: '/gatewayRoute' }
    }
  },
  computed: mapGetters(['yNEnumOptions']),
  mounted () {
    this.record.id && this.form.setFieldsValue(pick(this.record, fields))
  }
}
</script>

<style scoped>
</style>
