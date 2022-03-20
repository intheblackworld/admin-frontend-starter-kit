<template>
  <a-form :form="form">
    <a-form-item label="应用" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!initAppId">
      <a-select v-decorator="['appId', { rules: [{required: true, message: '请选择应用'}]} ]" placeholder="请选择" :disabled="this.$isModify(this.record)">
        <a-select-option v-for="item in appListStateOptions" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="权限名" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['name', { rules: $validator('请输入权限名') }]"/>
    </a-form-item>
    <a-form-item label="权限码" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['code', { rules: $validator('请输入权限码') }]"/>
    </a-form-item>
    <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择">
        <a-select-option v-for="item in roleStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['type', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择" :disabled="this.$isModify(this.record)">
        <a-select-option v-for="item in menuResourceTypeOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
const fields = ['name', 'appId', 'status', 'code', 'type']
const microFields = ['name', 'status', 'code', 'type']
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
      requestData: {
        url: '/permission'
      }
    }
  },
  computed: mapGetters(['roleStatusOptions', 'appListStateOptions', 'menuResourceTypeOptions', 'initAppId']),
  mounted () {
    this.initAppId ? this.form.setFieldsValue(pick(this.record, microFields)) : this.form.setFieldsValue(pick(this.record, fields))
  }
}
</script>

<style scoped>
</style>
