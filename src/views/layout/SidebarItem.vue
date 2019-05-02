<template>
    <div class='menu-wrapper'>
        <template v-for="item in routes">
            <router-link :key="item.path+'/'+item.children[0].path" v-if="!item.hidden&&item.noDropdown&&item.children.length>0" :to="item.children[0].path">
                <el-menu-item :index="item.children[0].path" class='submenu-title-noDropdown'>
                    <icon v-if='item.icon' :name="item.icon" />
                    <span style="margin-left: 7px;">{{item.children[0].name}}</span>
                </el-menu-item>
            </router-link>
            <el-submenu :key="item.name" :index="item.name" v-if="!item.noDropdown&&!item.hidden">
                <template slot="title">
                    <icon v-if='item.icon' :name="item.icon" style="width: 15px"></icon>
                    <span>{{item.name}}</span>
                </template>
                <template v-for="child in item.children" v-if='!child.hidden'>
                    <sidebar-item :key='[child]' class='nest-menu' v-if='child.children&&child.children.length>0'
                      :routes='[child]'> </sidebar-item>
                    <router-link :key="child.path" v-else :to="child.path">
                        <el-menu-item :index="child.path">
                        <span>{{child.name}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
        </template>
    </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    }
  }
}
</script>

<style>
  .menu-wrapper .el-submenu__title {
    padding: 0 8px !important;
    font-size: 13px;
    height: 40px;
    line-height: 40px;
  }

  .menu-wrapper.nest-menu .el-submenu__title {
    padding: 0 16px !important;
    font-size: 13px;
    height: 40px;
    line-height: 40px;
  }

  .menu-wrapper .el-menu-item, .el-menu--vertical .el-menu-item {
    padding: 0 16px !important;
    height: 36px;
    line-height: 36px;
  }

  .menu-wrapper.nest-menu .el-menu .el-menu-item {
    padding: 0 24px !important;
    height: 36px;
    line-height: 36px;
  }

  .menu-wrapper .el-menu-item span, .el-menu--vertical .el-menu-item span {
    font-size: 13px;
  }
</style>
