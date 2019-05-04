<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {}
  },
  methods: {
    // 页面刷新校验token值
    checkTokenActive () {
      const _this = this
      const token = _this.getSessionStorage('token')
      if (!token) {
        this.fetchToken()
      } else {
        _this.$router.addRoutes(this.constantRouterMap)
      }
    },
    // 页面刷新获取token值
    fetchToken () {
      console.log('fetchToken')
      const _this = this
      console.log(this)
      this.fetch(this.apiType.getToken, null, null,
        responseData => {
          console.log(this)
          _this.setSessionStorage('token', responseData.data.token)
          _this.$router.addRoutes(_this.constantRouterMap)
        })
    }
  },
  mounted () {
    this.checkTokenActive()
  }
}
</script>
<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
  // element-ui的table表格控件表头与内容列不对齐问题
</style>
