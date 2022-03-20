<template>
  <a-form :form="form">
    <a-form-item label="组织名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['name', { rules: $validatorO.name('请输入组织名称') }]" placeholder="请输入组织名称"/>
    </a-form-item>
    <a-form-item label="应用" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!initAppId">
      <a-select v-decorator="['appId', { rules: [{required: true, message: '请选择应用'} ]} ]" placeholder="请选择应用" @change="handleAppCheck">
        <a-select-option v-for="item in appOptions" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="上级组织" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['preId']" placeholder="请选择上级组织">
        <a-select-option v-for="item in preOrgOptions" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择状态">
        <a-select-option v-for="item in orgStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="会话时长" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['sessionType']" placeholder="请选择会话时长">
        <a-select-option v-for="item in appSessionTypeOptions" :key="item.value">{{ item.label }}</a-select-option>
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
const fields = ['name', 'appId', 'preId', 'status', 'summary', 'sessionType']
const microFields = ['name', 'preId', 'status', 'summary', 'sessionType']
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
      preOrgOptions: [],
      appOptions: [],
      requestData: {
        url: '/org',
        dispatchName: 'orgListState'
      }
    }
  },
  computed: mapGetters(['orgStatusOptions', 'appListStateFilterOptions', 'appListStateOptions', 'orgListStateFilterOptions', 'appSessionTypeOptions', 'initAppId']),
  mounted () {
    if (this.record.appId) {
      this.filterAppOrg(this.record.appId)
      if (this.record.preId === '-1') this.preOrgOptions = this.preOrgOptions.concat([{ name: '无上级组织', id: '-1' }])
      this.appOptions = this.appListStateOptions
    } else this.appOptions = this.appListStateFilterOptions
    if (this.initAppId) {
      this.filterAppOrg(this.initAppId)
      this.form.setFieldsValue(pick(this.record, microFields))
    } else this.form.setFieldsValue(pick(this.record, fields))
  },
  methods: {
    filterAppOrg (appId) {
      this.preOrgOptions = this.orgListStateFilterOptions.filter(el => el.appId === appId)
    },
    handleAppCheck (value) {
      this.form.resetFields(['preId'])
      this.filterAppOrg(value)
    }
  }
}
</script>

<style scoped>
</style>
