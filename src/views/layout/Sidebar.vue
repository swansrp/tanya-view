<template>
    <el-menu
        mode="vertical"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        theme="dark"
        unique-opened
        :default-active="$route.path"
        :collapse="isCollapse"
      >
      <sidebar-item :routes='permission_routers'></sidebar-item>
    </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
