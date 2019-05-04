<template>
  <div class="login-container" id='login'>
    <el-form class="login-form" autoComplete="on" :rules="loginRules" :model="loginForm" ref="loginForm"
             label-position="left">
      <div class="title-container">
        <h3 class="title">权限管理系统</h3>
      </div>
      <el-form-item prop="userName">
                <span class="svg-container svg-container_login">
                    <icon name="user"></icon>
                </span>
        <el-input name="userName"
                  type="text"
                  v-model="loginForm.userName"
                  autoComplete="on"
                  placeholder="登录名"/>
      </el-form-item>
      <el-form-item prop="password">
                <span class="svg-container">
                    <icon name="lock"></icon>
                </span>
        <el-input name="password"
                  :type="passwordBlur?'password':'text'"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.password"
                  autoComplete="on"
                  placeholder="密码">
          <i slot="suffix" class="el-icon-view" @click="changePasswordBlur"></i>
        </el-input>
      </el-form-item>
      <el-form-item prop="graphCode">
                <span class="svg-container">
                    <icon name="tags"></icon>
                </span>
        <el-input style="width:40%;"
                  name="graphCode"
                  type="graphCode"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.graphCode"
                  autoComplete="on"
                  placeholder="验证码"/>
        <img v-bind:src="graphCodeUrl"
             style="float: right; cursor:pointer;"
             @click="getPermitGraphCode()">
      </el-form-item>
      <el-button type="primary" class="loginBtn" @click.native.prevent="handleLogin">
        登录
      </el-button>
      <el-button type="primary" class="ssoBtn" @click.native.prevent="ssoLogin">
        微信登录
      </el-button>
    </el-form>
    <el-dialog :visible.sync="qrCodeDialog" @open="openQRCodeDialog()" @close="closeQRCodeDialog()">
      <div id="qrcode"></div>
    </el-dialog>
  </div>

</template>

<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'login',
  data () {
    return {
      loginRules: {
        userName: [{required: true, trigger: 'blur', message: '用户名不能为空'}],
        password: [{required: true, trigger: 'blur', message: '密码不能为空'}],
        graphCode: [{required: true, trigger: 'blur', message: '验证码不能为空'}]
      },
      loginForm: {
        userName: '',
        password: '',
        graphCode: ''
      },
      graphCodeUrl: '',
      passwordBlur: true,
      qrCodeDialog: false
    }
  },
  mounted () {
    this.fetchToken()
    this.getPermitGraphCode()
  },
  methods: {
    changePasswordBlur () {
      this.passwordBlur = !this.passwordBlur
    },
    getToken () {
      const _this = this
      const token = _this.getSessionStorage('token')
      if (!token) {
        this.fetchToken()
      }
      console.log('getToken')
      return token
    },
    getPermitGraphCode () {
      const _this = this
      const token = this.getToken()
      this.graphCodeUrl = _this.baseUrl + _this.apiType.getCaptcha.url + '?token=' + token + '&d=' + Math.random()
    },
    fetchToken () {
      console.log('fetchToken')
      const _this = this
      this.fetch(_this.apiType.getToken, null, null, responseData => {
        _this.setSessionStorage('token', responseData.data.token)
      })
    },
    handleLogin () {
      console.log('handleLogin')
      const _this = this
      const userInfo = {
        operator: this.loginForm.userName,
        password: this.loginForm.password,
        graphCode: this.loginForm.graphCode,
        token: _this.getSessionStorage('token')
      }
      _this.$store.dispatch('Login', userInfo).then(respData => {
        _this.setSessionStorage('auth_token', respData.data.token)
        _this.setSessionStorage('operator', respData.data.userName)
        _this.$router.push({path: '/'})
      }).catch(errData => {
        const message = errData.data
        _this.$alert(message)
        this.getPermitGraphCode()
      })
    },
    qrcode (url) {
      let qrcode = new QRCode('qrcode', {
        width: 132,
        height: 132,
        text: url, // 二维码地址
        colorDark: '#000',
        colorLight: '#fff'
      })
      console.log(qrcode)
    },
    closeQRCodeDialog () {
      this.qrCodeDialog = false
      document.getElementById('qrcode').innerHTML = ''
    },
    openQRCodeDialog () {
      console.log('openQRCodeDialog')
      this.$nextTick(function () {
        const token = this.getToken()
        this.qrcode(token)
      })
    },
    ssoLogin () {
      console.log('ssoLogin')
      this.qrCodeDialog = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .login-form {
      .el-form-item__error {
        position: absolute;
      }
    }

    .el-input {
      display: inline-block;
      height: 47px;
      width: 89%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;

        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
      margin-bottom: 20px;
    }

    .el-form-item__content {
      display: block;
      margin-left: 0px !important;
    }

    .el-form-item__error {
      position: absolute;
      padding-top: 5px !important;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 400px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;

      &_login {
        font-size: 20px;
      }
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        font-weight: 400;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }

      .set-language {
        color: #fff;
        position: absolute;
        top: 5px;
        right: 0px;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }

    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }

    .el-icon-view {
      vertical-align: middle;
      padding: 16px 5px 6px 15px;
    }

    .loginBtn {
      width: 35%;
      margin-left: 20px;
      float: left;
    }

    .ssoBtn {
      width: 35%;
      margin-right: 20px;
      float: right;
    }
  }
</style>
