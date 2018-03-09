<template>
<div class="main-con">
  <div class="left-menu-con" :style="{width:leftMenuWidth + 'px'}">
    <Menu :theme="leftMenuTheme" :width="200" active-name="menulist" :open-names="['1']" accordion @on-select="routeTo">
      <template v-for="item in menuList">
        <template v-if="item.children.length>0">
          <Submenu :name="item" :key="item.name">
            <template slot="title">
              <Icon :type="item.icon"></Icon>
              {{item.title}}
            </template>
            <MenuItem v-for="tmp in item.children" :name="tmp" :key="tmp.name">{{tmp.title}}</MenuItem>
          </Submenu>
        </template>
        <template v-else>
          <MenuItem :name="item" :key="item.name">
          <Icon :type="item.icon"></Icon>
          {{item.title}}
          </MenuItem>
        </template>
      </template>
    </Menu>
  </div>
  <div class="right-top-con" :style="{paddingLeft:leftMenuWidth + 'px'}">
    <div class="header">
      <Button class="header-menu-icon" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="this.shrink = !this.shrink">
        <Icon type="navicon" size="32"></Icon>
      </Button>
      <span class="header-title">
        <img v-if="systemObj.system_icon !== '' && systemObj.system_icon !== undefined" :src="iconPath" class="header-icon">
        {{systemObj.system_name}}
      </span>
      <div class="user-dropdown-menu-con">
        <Dropdown transfer placement="bottom-end" @on-click="handleClickUserDropdown">
          <a href="javascript:void(0)">
            <Avatar icon="person" size="small" /> {{userName}}
            <Icon type="arrow-down-b"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="ownSpace">个人中心</DropdownItem>
            <DropdownItem name="loginout" divided>退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="tags-con">
      <opened-page-tags :pageTagsList="pageTagsList"></opened-page-tags>
    </div>
  </div>
  <div class="single-page-con" :style="{paddingLeft:leftMenuWidth + 'px'}">
    <keep-alive :include="cachePage">
        <router-view></router-view>
    </keep-alive>
  </div>
</div>
</template>
<script>
import openedPageTags from './main-components/opened-page-tags.vue'
export default {
  components: {
    openedPageTags
  },
  data () {
    return {
      leftMenuTheme: this.$store.state.leftMenuTheme, // 左侧菜单样式
      leftMenuWidth: 200, // 左侧菜单宽度
      shrink: false, // 左侧菜单切换
      userName: '',
      systemObj: {system_name: '克莱特商务云平台'} // 系统名称对象
    }
  },
  computed: {
    menuList: function () {
      return this.$store.state.menuList // 左侧菜单列表
    },
    cachePage: function () {
      return this.$store.state.cachePage // 缓存的页面
    },
    pageTagsList: function () {
      return this.$store.state.pageOpenedList // 打开的页面列表
    },
    iconPath () { // 系统图标路径
      return '/apis' + this.systemObj.system_icon
    }
  },
  methods: {
    init: function () {
      this.$store.dispatch('updateMenuList')
      this.userName = localStorage.userName
      this.$store.dispatch('setSelectData')
      this.$api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: 'system_set'}, r => {
        if (r.data.rows.length > 0) {
          this.systemObj = r.data.rows[0]
        }
      })
    },
    handleClickUserDropdown (name) {
      if (name === 'ownSpace') {
        this.$store.dispatch('increateTag', {title: '个人中心', path: '', name: 'ownspace'})
        this.$router.push({
          name: 'ownspace'
        })
      } else if (name === 'loginout') {
        this.$store.commit('logout', this)
        this.$router.push({
          name: 'login'
        })
      }
    },
    routeTo: function (e) {
      this.$store.dispatch('increateTag', e)
      this.$router.push({
        path: '/' + e.name
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="scss">
@import "../style/style";
</style>
