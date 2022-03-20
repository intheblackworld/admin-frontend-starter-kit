<template>
  <div class="login">
    <div class="login-mask" />
    <div class="login-form-wrap">
      <div class="login-form">
        <span class="login-form__locale"></span>
        <div class="login-form__content px-2 py-10">
          <header v-show="activeKey !== 'install' && activeKey !== 'bind'">
            <h1 style="padding: 15px 0;">权限系统</h1>
          </header>
          <div class="line" v-if="activeKey === 'verify'"></div>
          <div v-show="activeKey === 'login'">
            <a-form
              id="formLogin"
              class="mx-auto mt-10"
              ref="formLogin"
              :form="form"
              @submit="handleSubmit">
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  placeholder="账户"
                  v-decorator="[
                    'account',
                    {rules: [
                      { required: true, message: '请输入用户名' },
                      {whitespace:true, message: '不可以输入空格'}
                    ], validateTrigger: 'blur'}
                  ]">
                  <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-input-password
                  size="large"
                  type="password"
                  autocomplete="off"
                  placeholder="密码"
                  v-decorator="[
                    'password',
                    {rules: [
                      { required: true, message: '请输入密码' ,},
                      { max:16, message: '输入长度不可以超过16位' },
                      {whitespace:true, message: '不可以输入空格'}
                    ], validateTrigger: 'blur',
                    }
                  ]">
                  <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <a-input
                  size="large"
                  type="text"
                  autocomplete="off"
                  placeholder="请输入验证码"
                  v-decorator="['captcha',{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                  <a-icon slot="prefix" type="code" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
                <img :src="imgUrl" @click="changeImgCode" style="width:100%; height: 50px; margin-top:10px;">
              </a-form-item>
              <a-form-item style="margin-top:24px">
                <a-button
                  :block="true"
                  size="large"
                  type="primary"
                  htmlType="submit"
                  class="rounded-sm"
                >登录</a-button>
              </a-form-item>
            </a-form>
          </div>
          <div class="install" v-show="activeKey === 'install'">
            <div class="install-back" @click="activeKey = 'login'">
              <a><a-icon type="left"></a-icon>返回</a>
            </div>
            <div class="content-tittle">
              <span>安装应用</span>
            </div>
            <div class="install-tip">
              <span>账号<strong style="color: red;">{{ account }}</strong>请按照以下步骤完成绑定操作</span>
            </div>
            <div class="line"></div>
            <div class="install-tip">
              <span>扫二维码安装Google Authenticator应用</span>
            </div>
            <div class="install-code">
              <div class="android">
                <img src="@/assets/i.png">
                <span>Android手机下载</span>
              </div>
              <div class="iphone">
                <img src="@/assets/i.png">
                <span>IPhone手机下载</span>
              </div>
            </div>
            <div class="install-tip">
              <span>安装完成后点击下一步进入绑定页面</span><br>
              <span>（如已安装，直接进入下一步）</span>
            </div>
            <div class="install-next">
              <a-button :block="true" size="large" type="primary" class="btn login-button" @click="activeKey = 'bind'">下一步</a-button>
            </div>
          </div>
          <div class="bind" v-show="activeKey === 'bind'">
            <div class="bind-back" @click="activeKey = 'install'">
              <a><a-icon type="left"></a-icon>返回</a>
            </div>
            <div class="content-tittle">
              <span>绑定一次性密码验证器</span>
            </div>
            <div class="bind-tip">
              <span>账号<strong style="color: red;">{{ account }}</strong>请按照以下步骤完成绑定操作</span>
            </div>
            <div class="line bind-line"></div>
            <div class="bind-tip">
              <span>请用Google Authenticator应用扫码以下二维码</span>
            </div>
            <div id="qrcode" ref="qrcode" style="width: 120px; margin: 10px auto;"></div>
            <a-form :form="form2" @submit="bind" class="mx-auto">
              <a-form-item>
                <a-input v-decorator="['code',{rules: $validator('请输入谷歌验证码', { pattern: /^\d{6}$/, message:'请输入6位验证码' })}]" size="large" placeholder="请输入谷歌验证码"/>
              </a-form-item>
              <a-form-item style="margin-top:24px">
                <a-button :block="true" size="large" type="primary" htmlType="submit" class="login-button">下一步</a-button>
              </a-form-item>
            </a-form>
          </div>
          <div class="verify-form" v-show="activeKey === 'verify'">
            <div class="back" @click="activeKey = 'login'">
              <a><a-icon type="left"></a-icon>返回</a>
            </div>
            <div class="content-tittle" style="margin-bottom: 20px;">
              <span>输入谷歌口令</span>
            </div>
            <a-form :form="form1" @submit="verify" class="mx-auto">
              <a-form-item>
                <a-input v-decorator="['code',{rules: $validator('请输入谷歌验证码', { pattern: /^\d{6}$/, message:'请输入6位验证码' })}]" size="large" autocomplete="off" placeholder="请输入谷歌验证码"/>
              </a-form-item>
              <a-form-item style="margin-top:24px">
                <a-button :block="true" size="large" type="primary" htmlType="submit" class="login-button">下一步</a-button>
                <span>如您不能提供验证码，请联系系统管理员！</span>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import { guid } from '@/utils/util'
import { mapActions } from 'vuex'
import { googleCode } from '@/api/login'
export default {
  data () {
    return {
      activeKey: 'login',
      form: this.$form.createForm(this, { name: 'login' }),
      form1: this.$form.createForm(this, { name: 'verify' }),
      form2: this.$form.createForm(this, { name: 'bind' }),
      imgUrl: '',
      uuid: '',
      account: '',
      googleId: '',
      qrcodeObj: null
    }
  },
  methods: {
    ...mapActions(['Login']),
    changeImgCode () {
      this.uuid = guid()
      this.$http({
        url: '/captcha',
        methods: 'get',
        headers: {
          'Request-Id': this.uuid
        }
      }).then(res => {
        this.imgUrl = res.data
      })
    },
    bind (e) {
      e.preventDefault()
      const { form2: { validateFields } } = this
      validateFields((err, values) => {
        if (!err) {
          googleCode({ account: this.account, ...values }, { headers: { 'Request-Google-Id': this.googleId } }).then(res => {
            const { code, msg } = res
            if (code === '0000') {
              this.resetCaptcha()
              this.$notification.success({ message: '绑定成功' })
              this.activeKey = 'login'
            } else this.failRequest(msg)
          })
        }
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const { form: { validateFields }, Login } = this
      validateFields((err, values) => {
        if (!err) {
          Login({ data: values, headers: { 'Request-Id': this.uuid } })
            .then((res) => {
              const { code, msg, data } = res
              if (code === '0000') {
                this.account = values.account
                if (data) {
                  if (data.googleId) {
                    this.activeKey = 'install'
                    if (this.qrcodeObj) {
                      this.qrcodeObj.makeCode(data.qrcode)
                    } else this.qrcode(data.qrcode)
                    this.googleId = data.googleId
                  } else {
                    this.$store.dispatch('LoginSuccess', { account: this.account, token: data }).then(() => {
                      this.loginSuccess()
                    })
                  }
                } else {
                  this.activeKey = 'verify'
                }
              } else this.failRequest(msg)
            })
            .catch(err => this.requestFailed(err))
        }
      })
    },
    verify (e) {
      e.preventDefault()
      const { form1: { validateFields, resetFields } } = this
      validateFields((err, values) => {
        if (!err) {
          googleCode({ account: this.account, ...values }, { headers: {} }).then(res => {
            const { code, msg, data } = res
            if (code === '0000') {
              this.$store.dispatch('LoginSuccess', { account: this.account, token: data }).then(() => {
                this.loginSuccess()
              })
            } else {
              resetFields(['code'])
              this.failRequest(msg)
              this.activeKey = 'login'
            }
          })
        }
      })
    },
    failRequest (message) {
      this.resetCaptcha()
      this.$notification.error({ message })
    },
    resetCaptcha () {
      const { form: { resetFields } } = this
      resetFields(['captcha'])
      this.changeImgCode()
    },
    loginSuccess () {
      this.$router.push({ path: '/' })
    },
    requestFailed (err) {
      console.log(err)
    },
    qrcode (text) {
      console.log(text)
      // eslint-disable-next-line
      this.qrcodeObj = new QRCode('qrcode', {
        width: 120,
        height: 120,
        colorDark: '#000',
        colorLight: '#fff',
        text
      })
    }
  },
  created () {
    this.changeImgCode()
  }
}
</script>

<style lang="less" scoped>
  @import (reference) '../../design/index.less';
  .login-form__locale {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 1;
  }
  .login {
    position: relative;
    height: 100vh;
    background: url(../../assets/login-bg.png) no-repeat;
    background-size: 100% 100%;

    &-mask {
      display: none;
      height: 100%;
      background: url(../../assets/login-in.png) no-repeat;
      background-position: 30% 30%;
      background-size: 80% 80%;
      .respond-to(xlarge, { display: block;});
    }

    &-form {
      position: relative;
      bottom: 60px;
      width: 400px;
      background: #fff;
      border: 10px solid rgba(255, 255, 255, 0.5);
      border-width: 8px;
      border-radius: 4px;
      background-clip: padding-box;
      .respond-to(xlarge, { margin: 0 200px 0 50px});

      &-wrap {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        width: 100%;
        height: 100%;
        // height: 90%;
        justify-content: center;
        align-items: center;
        .respond-to(xlarge, {
        justify-content: flex-end;
          });
      }

      &__content {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 20px 0 20px 0;
        border: 1px solid #999;
        border-radius: 2px;

        header {
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            display: inline-block;
            width: 100px;
            margin-left: -50px;
          }
          h1 {
            margin-bottom: 0;
            font-size: 24px;
            text-align: center;
          }
        }
        form {
          width: 80%;
        }
      }
    }
  }
  .mx-auto {
    margin-left: auto;
    margin-right: auto;
  }
  .mt-10 {
    margin-top: 20px;
  }
  .verify-form {
  padding: 10px;
}
.install {
  padding: 10px;
  .install-tip {
    text-align: center;
    margin: 10px 0;
  }
  .install-code {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    .android,.iphone {
      width: 45%;
      text-align: center;
      float: left;
      img {
        width: 100%;
      }
    }
    .iphone {
      margin-left: 8%;
    }
  }
}
.bind {
  padding: 10px;
  .bind-tip {
    text-align: center;
    margin: 10px 0;
  }
  .bind-line {
    margin-bottom: 20px;
  }
}
.content-tittle {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}
.back {
  margin: -10px 0 30px 0;
}
.install-back {
  margin: -10px 0 10px 0;
}
.bind-back {
  margin: -10px 0 10px 0;
}
.line {
  width: 90%;
  height: 3px;
  background: rgba(128, 128, 128, 0.429);
  margin: 20px auto;
}
</style>
