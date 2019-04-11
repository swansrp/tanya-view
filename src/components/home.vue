<template>
  <div>
    <el-container class="home-container">
      <el-header class="home-header">
        <span class="home_title">滨海金融</span>
        <div style="display: flex;align-items: center;margin-right: 7px">
          <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link home_userinfo" style="display: flex;align-items: center">
            {{role}}
            <i>
              <img v-if="user.name!=''" :src="user.name" style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/>
              <img v-else :src="user.name" style="width: 40px;height: 40px;margin-right: 5px;margin-left: 5px;border-radius: 40px"/>
            </i>
          </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="180px" class="home-aside">
          <div style="display: flex;justify-content: flex-start;width: 180px;text-align: left;">
            <el-menu style="background: #ececec;width: 180px;" unique-opened router>
              <template v-for="(item,index) in this.routes" v-if="!item.hidden">
                <el-submenu :key="index" :index="index+''">
                  <template slot="title">
                    <i :class="item.iconUrl" style="color: #20a0ff;width: 14px;"></i>
                    <span slot="title">{{item.name}}</span>
                  </template>
                  <el-menu-item width="180px"
                                style="padding-left: 30px;padding-right:0px;margin-left: 0px;width: 170px;text-align: left"
                                v-for="child in item.children"
                                :index="child.path"
                                :key="child.path">{{child.name}}
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
            </el-breadcrumb>
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!this.$route.meta.keepAlive"></router-view>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import {getUserInfo} from '@/api/user'
import {getMenuTree} from '@/api/menu'
import {logoff} from '@/api/login'
export default{
  mounted: function () {
    this.initUserInfo()
    this.initMenuTree()
  },
  methods: {
    initUserInfo () {
      let _this = this
      let role = _this.$store.state.user.role
      if (role == null || role === undefined || role === '') {
        getUserInfo(_this.$store)
      }
    },
    initMenuTree () {
      let _this = this
      let menu = _this.$store.state.menu
      if (menu.length === 0) {
        getMenuTree(_this.$router, _this.$store)
      }
    },
    handleCommand (cmd) {
      let _this = this
      if (cmd === 'logout') {
        this.$confirm('注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          logoff(this)
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '取消'
          })
        })
      }
    }
  },
  data () {
    return {
      isDot: false
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    routes () {
      return this.$store.state.menu
    },
    role () {
      switch (this.$store.state.user.role) {
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
      }
    }
  }
}
</script>
<style>
  .home-container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .home-header {
    background-color: #20a0ff;
    color: #333;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 0px;
  }

  .home-aside {
    background-color: #ECECEC;
  }

  .home-main {
    background-color: #fff;
    color: #000;
    text-align: center;
    margin: 0px;
    padding: 0px;;
  }

  .home_title {
    color: #fff;
    font-size: 22px;
    display: inline;
    margin-left: 8px;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .el-submenu .el-menu-item {
    width: 180px;
    min-width: 175px;
  }
</style>
