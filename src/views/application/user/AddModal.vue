<template>
  <a-form :form="form">
    <a-form-item label="账号" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['account', { rules: $validator('请输入账号', 16) }]" :disabled="this.$isModify(this.record)" placeholder="请输入账号"/>
    </a-form-item>
    <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input v-decorator="['name', { rules: $validatorO.name('请输入姓名') }]" placeholder="请输入姓名"/>
    </a-form-item>
    <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-input-password v-decorator="['password', { rules: [{ required: true, message: '请输入密码' }, { validator: this.handlePasswordCheck }] }]" :style="this.$isModify(this.record)? 'width: 66%': 'width: 85%'" disabled>
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input-password>
      <a-button type="primary" @click="reset" style="margin-left: 10px;" v-if="this.$isModify(this.record)">重置密码</a-button>
      <a-button type="primary" @click="doCopy(initPassword)" style="margin-left: 15px;" v-show="initPassword">复制</a-button>
    </a-form-item>
    <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
    <a-form-item label="应用" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!initAppId">
      <a-select v-decorator="['appId', { rules: [{required: true, message: '请选择应用'} ]} ]" placeholder="请选择应用" @change="handleAppCheck">
        <a-select-option v-for="item in appOptions" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="组织" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['orgId', { rules: [{required: true, message: '请选择组织'} ]} ]" placeholder="请选择组织">
        <a-select-option v-for="item in preOrgOptions" :key="item.id">{{ item.name }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['status', { rules: [{required: true, message: '请选择状态'} ]} ]" placeholder="请选择状态">
        <a-select-option v-for="item in userStatusOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="会话时长" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-select v-decorator="['sessionType', { rules: [{required: true, message: '请选择会话时长'} ]} ]" placeholder="请选择会话时长">
        <a-select-option v-for="item in appSessionTypeOptions" :key="item.value">{{ item.label }}</a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import { mapGetters } from 'vuex'
import { randomPassword } from '@/utils/util'
const fields = ['name', 'account', 'appId', 'status', 'orgId', 'sessionType', 'password']
const microFields = ['name', 'account', 'status', 'orgId', 'sessionType', 'password']
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
      preOrgOptions: [],
      appOptions: [],
      initPassword: '',
      copyCount: 0,
      requestData: {
        url: '/rbacUser',
        dispatchName: 'userListState'
      }
    }
  },
  computed: mapGetters(['userStatusOptions', 'appListStateFilterOptions', 'appListStateOptions', 'orgListStateFilterOptions', 'appSessionTypeOptions', 'initAppId']),
  mounted () {
    const data = JSON.parse(JSON.stringify(this.record))
    if (data.id) {
      Object.assign(data, {
        password: '****'
      })
    } else {
      this.initPassword = randomPassword()
      data.password = this.initPassword
    }
    Object.assign(this, {
      imageUrl: this.record.avatar,
      loading: false,
      copyCount: 1
    })
    if (this.record.appId) {
      this.filterAppOrg(this.record.appId)
      if (this.record.preId === '-1') this.preOrgOptions = this.preOrgOptions.concat([{ name: '无上级组织', id: '-1' }])
      this.appOptions = this.appListStateOptions
    } else this.appOptions = this.appListStateFilterOptions
    if (this.initAppId) {
      this.filterAppOrg(this.initAppId)
      this.form.setFieldsValue(pick(data, microFields))
    } else this.form.setFieldsValue(pick(data, fields))
  },
  methods: {
    submitValidate () {
      if (!this.copyCount) {
        this.$notification.error({ message: '请先复制密码' })
        return false
      }
      return true
    },
    reset () {
      this.copyCount = 0
      this.initPassword = randomPassword()
      this.form.setFieldsValue({ password: this.initPassword })
      this.$message.success('密码已重置')
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
        this.requestData.asigndata = { avatar: this.imageUrl }
        this.loading = false
      })
    },
    filterAppOrg (appId) {
      this.preOrgOptions = this.orgListStateFilterOptions.filter(el => el.appId === appId)
    },
    handleAppCheck (value) {
      this.form.resetFields(['orgId'])
      this.filterAppOrg(value)
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
    }
  }
}
</script>

<style scoped>
</style>
