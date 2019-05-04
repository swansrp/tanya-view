<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
        <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
        <levelbar></levelbar>
        <tabs-view></tabs-view>
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <span class="user-avatar">{{operator}}</span>
                <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu class="user-dropdown" slot="dropdown">
                <el-dropdown-item><span @click="openMyInfoDialog" style="display:block;">我的</span></el-dropdown-item>
                <el-dropdown-item><span @click="logout" style="display:block;">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <screenfull class='screenfull'></screenfull>
    </el-menu>

    <el-dialog title="我的信息" :visible.sync="myInfoDialog" width="40%">
      <el-form :model="self" class="demo-ruleForm" ref="detailsForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="self.name"></el-input>
        </el-form-item>
        <el-form-item label="角色备注" :label-width="formLabelWidth">
          <el-input v-model="self.comment"></el-input>
        </el-form-item>
        <el-form-item label="到期时间" :label-width="formLabelWidth"/>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Levelbar from './Levelbar'
import TabsView from './TabsView'
import Screenfull from '@/components/Screenfull'
import Hamburger from '@/components/Hamburger'

export default {
  data () {
    return {
      operator: this.getSessionStorage('operator'),
      apiName: {
        logOut: this.apiType.logOut
      },
      self: {
        name: '',
        comment: '',
        email: '',
        password: '',
        phone: '',
        role: ''
      },
      formLabelWidth: '50px',
      myInfoDialog: false
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
    this.getUserInfo()
    // this.getRoleInfo()
  },
  methods: {
    getUserInfo () {
      this.fetch(this.apiType.getUserInfo, null, null,
        respData => {
          this.self.name = respData.data.name
          this.self.phone = respData.data.phone
          this.self.email = respData.data.email
          this.self.comment = respData.data.comment
          this.self.role = this.convertRole(respData.data.roleId)
        })
    },
    convertRole (roleId) {
      switch (roleId) {
        case 1:
          return '超级管理员'
        case 2:
          return '地方管理员'
        case 3:
          return '商业渠道'
        case 4:
          return '药厂主管'
        case 5:
          return '销售代表'
        case 6:
          return '促销员'
        default:
          return '暂无角色'
      }
    },
    openMyInfoDialog () {
      this.myInfoDialog = true
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
