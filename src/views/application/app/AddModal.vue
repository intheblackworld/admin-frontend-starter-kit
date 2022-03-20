<template>
  <a-form :form="form">
    <a-form-item label="应用名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['name', { rules: $validatorO.name('请输入应用名称') }]" placeholder="请输入应用名称"/>
    </a-form-item>
    <a-form-item label="应用编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['appCode', { rules: [{ required: true, message: '请输入应用编码' }, { min: 3, message: '输入长度3~20位' }, { max: 20, message: `输入长度3~20位` }, { validator: this.handleCodeCheck }] }]" placeholder="请输入应用编码"/>
    </a-form-item>
    <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['jwtType', { rules: [{required: true, message: '请选择类型'} ]} ]" placeholder="请选择类型" @change="handleTypeChange">
        <a-select-option v-for="item in jwtTypeOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="关联应用" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="jwtType === 'Relation'">
      <a-select v-decorator="['relationCode', { rules: [{required: true, message: '请选择应用'} ]} ]" placeholder="请选择应用">
        <a-select-option v-for="item in appListStateOptions" :key="item.appCode">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="域名" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['appDomain', { rules: [{ required: true, message: '请输入域名,不要协议和/结尾,如:www.baidu.com' }] }]" placeholder="请输入域名,不要协议和/结尾,如:www.baidu.com"/>
    </a-form-item>
    <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择状态">
        <a-select-option v-for="item in appStateOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="logo" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-upload
        name="avatar"
        :beforeUpload="beforeUpload"
        class="avatar-uploader"
        :show-upload-list="false"
        :customRequest="handleChange"
        list-type="picture-card">
        <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 50px;"/>
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
          <div class="ant-upload-text">
            Upload
          </div>
        </div>
      </a-upload>
      <span style="position: absolute; top:-70px; right:70px; width:300px;">请上传200kb以内png、jpg类型图片</span>
    </a-form-item>
    <a-form-item label="会话时长" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['sessionType', { rules: [{required: true, message: '请选择会话时长'} ]} ]" placeholder="请选择会话时长">
        <a-select-option v-for="item in appSessionTypeOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="超管账号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!this.$isModify(this.record)">
      <a-input v-decorator="['account']" disabled/>
    </a-form-item>
    <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!this.$isModify(this.record)">
      <a-input-password v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }, { validator: this.handlePasswordCheck }] }]" :style="this.$isModify(this.record)? '': 'width: 85%'" :disabled="!this.$isModify(this.record)">
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input-password>
      <a-button type="primary" @click="doCopy(initPassword)" style="margin-left: 20px;" v-if="!this.$isModify(this.record)">复制</a-button>
    </a-form-item>
    <a-form-item label="ip白名单" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-textarea :auto-size="{ minRows: 2 }" v-decorator="['ip', { rules: [{ required: false, message: '请输入IP' }, { pattern: /^(?:(?:^|,)(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(?:\.(?:[0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3})+$/, message: 'ip格式不正确' }] } ]" placeholder="多个ip逗号隔开"/>
    </a-form-item>
    <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-textarea :auto-size="{ minRows: 2 }" v-decorator="['summary', { rules: $validatorO.summary() }]" placeholder="多行输入"/>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
import { randomPassword } from '@/utils/util'
const fields = ['name', 'appCode', 'appDomain', 'status', 'sessionType', 'ip', 'summary', 'account', 'password', 'jwtType']
const editFields = ['name', 'appCode', 'appDomain', 'status', 'sessionType', 'ip', 'summary', 'jwtType']
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
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
      loading: false,
      imageUrl: '',
      initPassword: '',
      copyCount: 0,
      jwtType: '',
      requestData: {
        url: '/app',
        dispatchName: 'appListState'
      }
    }
  },
  computed: mapGetters(['appStateOptions', 'appSessionTypeOptions', 'jwtTypeOptions', 'appListStateOptions']),
  mounted () {
    Object.assign(this, {
      imageUrl: this.record.logo,
      jwtType: this.record.jwtType,
      loading: false
    })
    this.record.appIp && this.record.appIp.ip && (this.record.ip = this.record.appIp.ip)
    if (this.record && this.record.id) {
      this.form.setFieldsValue(pick(this.record, editFields))
      if (this.record.jwtType === 'Relation') {
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.record, ['relationCode']))
        })
      }
    } else {
      this.initPassword = randomPassword()
      this.record.password = this.initPassword
      this.form.setFieldsValue(pick(this.record, fields))
    }
  },
  methods: {
    submitValidate () {
      if (!this.$isModify(this.record)) {
        if (!this.copyCount) {
          this.$notification.error({ message: '请先复制密码' })
          return false
        }
        return true
      }
      return true
    },
    beforeUpload (file) {
      return new Promise((resolve, reject) => {
        const testmsg = /^image\/(png|jpg|jpeg)$/.test(file.type)
        const isLt2M = file.size / 1024 < 200
        if (!testmsg) {
            this.$message.error('上传图片格式不对!')
            // eslint-disable-next-line
            return reject(false)
        }
        if (!isLt2M) {
            this.$message.error('上传图片大小不能超过200kb!')
            // eslint-disable-next-line
            return reject(false)
        }
        return resolve(true)
      })
    },
    handleChange (info) {
      getBase64(info.file, imageUrl => {
        this.imageUrl = imageUrl
        this.requestData.asigndata = { logo: this.imageUrl }
        this.loading = false
      })
    },
    doCopy (text) {
      this.$copyText(text).then(e => {
        this.copyCount++
        this.$message.success('复制完毕')
      }).catch(err => {
        console.log('copy.err', err)
        this.$message.error('复制失败')
      })
    },
    handlePasswordCheck (rule, value, callback) {
      if (value) {
        if (value === '****') {
          callback()
        } else {
          if (value.length < 10) {
            callback(new Error('密码在10～16位'))
          }
          if (value.length > 16) {
            callback(new Error('密码在10～16位'))
          }
          if (value.includes('$')) {
            callback(new Error('不能有$符合'))
          }
          callback()
        }
      } else callback()
    },
    handleCodeCheck (rule, value, callback) {
      if (value) {
        if (!this.$isModify(this.record)) {
          this.form.setFieldsValue({ account: `${value}_admin` })
        }
        callback()
      } else callback()
    },
    handleTypeChange (value) {
      this.jwtType = value
    }
  }
}
</script>

<style scoped>
</style>
