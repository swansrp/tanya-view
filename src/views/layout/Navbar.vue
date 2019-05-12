<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <levelbar></levelbar>
      <tabs-view></tabs-view>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-avatar">{{name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item>
            <span @click="openMyInfoDialog" style="display:block;">账号信息</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <screenfull class='screenfull'></screenfull>
    </el-menu>

    <el-dialog title="账号信息" :visible.sync="accountDialog" width="40%" center>
      <el-form :model="account" class="demo-ruleForm" ref="detailsForm" :rules="rules">
        <el-form-item label="账号名称" :label-width="formLabelWidth" prop="username">
          <el-input v-model="account.username" :disabled="operator != null"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" :label-width="formLabelWidth" v-if="role.roleType !== ''">
          <el-input v-model="role.title" :disabled="operator != null"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth" v-if="role.roleType !== '' ">
          <el-input v-model="role.comment" :disabled="operator != null"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" :label-width="formLabelWidth" v-if="role.roleType !== '' ">
          <el-input v-model="role.endAt" :disabled="operator != null" :value="role.endAt.substring(0,8)"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="account.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="account.phone"></el-input>
        </el-form-item>
        <el-form-item label="账号邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="account.email"></el-input>
        </el-form-item>
        <el-form-item label="账号密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="account.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="密码确认" :label-width="formLabelWidth" prop="passwordConfirm">
          <el-input v-model="account.passwordConfirm" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" style="margin-top:5px;" type="primary" @click="validateForm('detailsForm')">确 定
          </el-button>
          <el-button size="small" style="margin-top:5px;" @click="accountDialog = false">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Levelbar from './Levelbar'
import TabsView from './TabsView'
import Screenfull from '@/components/Screenfull'
import Hamburger from '@/components/Hamburger'

export default {
  data () {
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value === '') {
        if (!this.currentSelectUserId) {
          callback(new Error('请再次输入密码'))
        } else {
          callback()
        }
      } else if (value !== this.account.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '' || !value) {
        if (!this.isModifyAccountInfo) {
          callback(new Error('请输入密码'))
        }
      } else {
        if (value.length < 6) {
          callback(new Error('密码长度不小于6位'))
        } else if (value.length > 18) {
          callback(new Error('密码长度不大于18位'))
        } else if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(value) === false) {
          callback(new Error('密码必须是数字和字母组合'))
        } else {
          callback()
        }
      }
    }
    return {
      rules: {
        username: [{required: true, message: '请输入账户名称', trigger: 'blur'},
          {max: 20, message: '长度不大于20', trigger: 'blur'},
          {pattern: /^[A-Za-z]+$/, message: '账号只支持英文字母'}
        ],
        name: [{required: true, message: '请输入用户姓名', trigger: 'blur'},
          {max: 20, message: '长度不大于20', trigger: 'blur'},
          {pattern: /^[\S]*$/, message: '用户名不能包含不可见字符'}
        ],
        phone: [{required: false, message: '请输入电话号码', trigger: 'blur'},
          {max: 60, message: '长度不大于60', trigger: 'blur'},
          {pattern: /^([0-9-]+)$/, message: '不是有效的电话号码'}
        ],
        email: [{required: true, message: '请输入用户邮箱', trigger: 'blur'},
          {max: 60, message: '长度不大于60', trigger: 'blur'},
          {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '不是有效的邮箱'}
        ],
        password: [{required: false, message: '请输入密码', trigger: 'blur'},
          {validator: validatePassword, trigger: 'blur'}
        ],
        passwordConfirm: [
          {required: false, message: '请输入确认密码', trigger: 'blur'},
          {validator: validatePasswordConfirm, trigger: 'blur'}

        ]
      },
      operator: this.getSessionStorage('operator'),
      name: this.getSessionStorage('name'),
      apiName: {
        logOut: this.apiType.logOut
      },
      role: {
        roleType: '',
        id: '',
        title: '',
        comment: '',
        startAt: '',
        endAt: '',
        permission: {}
      },
      account: {
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        passwordConfirm: ''
      },
      formLabelWidth: '50px',
      accountDialog: false,
      isModifyAccountInfo: false
    }
  },
  components: {
    Levelbar,
    Hamburger,
    TabsView,
    Screenfull

  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted () {
    this.operatorValidate()
    this.getUserInfo()
    this.getRoleInfo()
  },
  methods: {
    validateForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch('UpdateUserInfo', {
            email: this.account.email,
            name: this.account.name,
            password: this.account.password,
            phone: this.account.phone,
            username: this.account.username
          }).then(respData => {
            this.account = this.$store.getters.self
            this.account.username = this.getSessionStorage('operator')
          })
        } else {
          return false
        }
      })
    },
    getUserInfo () {
      this.$store.dispatch('GetUserInfo').then(respData => {
        this.account = this.$store.getters.self
        this.account.username = this.getSessionStorage('operator')
      })
    },
    getRoleInfo () {
      this.$store.dispatch('GetRoleInfo').then(respData => {
        this.role = this.$store.getters.role
      })
    },
    operatorValidate () {
      if (this.operator == null || this.operator === '') {
        this.accountDialog = true
      }
    },
    openMyInfoDialog () {
      this.accountDialog = true
    },
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    },
    logout () {
      const _this = this
      this.$confirm('此操作将退出登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'confirmTimeOut',
        type: 'warning'
      }).then(() => {
        _this.$store.dispatch('LogOff').then(respData => {
          this.removeSessionStorage('auth_token')
          this.removeSessionStorage('operator')
          this.removeSessionStorage('name')
          this.removeSessionStorage('token')
          // location.reload()
          _this.$router.push({path: '/login'})
        }).catch(errData => {
          const message = errData.data
          _this.$alert(message)
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-input {
    display: inline-block;
    height: 30px;
    width: 89%;
  }
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .errLog-container {
      display: inline-block;
      position: absolute;
      right: 150px;
    }

    .screenfull {
      position: absolute;
      right: 8px;
      top: 16px;
      color: red;
    }

    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 55px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>
