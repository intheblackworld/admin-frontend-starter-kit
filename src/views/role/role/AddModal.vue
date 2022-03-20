<template>
  <a-form :form="form">
    <a-form-item label="应用" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!initAppId">
      <a-select v-decorator="['appId', { rules: [{required: true, message: '请选择应用'}]} ]" placeholder="请选择应用">
        <a-select-option v-for="item in appOptions" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['name', { rules: $validatorO.name('请输入角色名') }]" placeholder="请输入角色名"/>
    </a-form-item>
    <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择状态">
        <a-select-option v-for="item in roleStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['type', { rules: [{required: true, message: '请选择类型'} ]} ]" placeholder="请选择类型">
        <a-select-option v-for="item in microAppRoleTypeOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-textarea :auto-size="{ minRows: 2 }" v-decorator="['summary', { rules: $validatorO.summary() }]" placeholder="多行输入"/>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
const fields = ['name', 'appId', 'status', 'summary', 'type']
const microFields = ['name', 'status', 'summary', 'type']
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
      appOptions: [],
      requestData: {
        url: '/role',
        dispatchName: 'roleListState'
      }
    }
  },
  computed: mapGetters(['roleStatusOptions', 'appListStateFilterOptions', 'appListStateOptions', 'microAppRoleTypeOptions', 'initAppId']),
  mounted () {
    this.appOptions = this.record.id ? this.appListStateOptions : this.appListStateFilterOptions
    this.initAppId ? this.form.setFieldsValue(pick(this.record, microFields)) : this.form.setFieldsValue(pick(this.record, fields))
  }
}
</script>

<style scoped>
</style>
