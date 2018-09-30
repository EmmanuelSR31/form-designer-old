<template>
<div class="main-con">
  <div class="left-menu-con" :style="{width: leftMenuWidth + 'px'}">
    <Menu :theme="leftMenuTheme" width="200px" active-name="menulist" :open-names="['1']" accordion @on-select="routeTo">
      <template v-for="item in menuList">
        <!-- <template v-if="item.children.length>0">
          <Submenu :name="item" :key="item.url">
            <template slot="title">
              <Icon :type="item.iconCls"></Icon>
              {{item.text}}
            </template>
            <MenuItem v-for="tmp in item.children" :name="tmp" :key="tmp.url">{{tmp.text}}</MenuItem>
          </Submenu>
        </template>
        <template v-else>
          <MenuItem :name="item" :key="item.url">
            <Icon :type="item.iconCls" :key="item.url"></Icon>
            {{item.text}}
          </MenuItem>
        </template> -->
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
            <Icon :type="item.icon" :key="item.name"></Icon>
            {{item.title}}
          </MenuItem>
        </template>
      </template>
    </Menu>
  </div>
  <div class="right-top-con" :style="{paddingLeft:leftMenuWidth + 'px'}">
    <div class="header">
      <Button class="header-menu-icon" :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="changeMenuWidth">
        <Icon type="md-reorder" size="32"></Icon>
      </Button>
      <span class="header-title">
        <img v-if="systemObj.system_icon !== '' && systemObj.system_icon !== undefined" :src="iconPath" class="header-icon">
        {{systemObj.system_name}}
      </span>
      <div class="user-dropdown-menu-con">
        <Dropdown transfer placement="bottom-end" @on-click="handleClickUserDropdown">
          <a href="javascript:void(0)">
            <Avatar icon="md-person" size="small" /> {{userName}}
            <Icon type="md-arrow-dropdown" />
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="ownSpace">个人中心</DropdownItem>
            <DropdownItem name="editPassword">修改密码</DropdownItem>
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
  <Modal v-model="modalPassword" title="修改密码" @on-ok="savePassword">
    <div class="modal-field-con">
      <div>
        <Form ref="formPosition" :model="passwordObj" :label-width="120">
          <FormItem label="旧密码" class="whole-line-703">
            <Input v-model="passwordObj.oldPass" type="password"></Input>
          </FormItem>
          <FormItem label="新密码" class="whole-line-703">
            <Input v-model="passwordObj.newPass" type="password"></Input>
          </FormItem>
          <FormItem label="确认新密码" class="whole-line-703">
            <Input v-model="passwordObj.newPass1" type="password"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
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
      systemObj: {system_name: '克莱特商务云平台'}, // 系统名称对象
      modalPassword: false,
      passwordObj: {} // 密码对象
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
    changeMenuWidth: function () { // 切换菜单显示
      this.shrink = !this.shrink
      if (this.shrink) {
        this.leftMenuWidth = 0
      } else {
        this.leftMenuWidth = 200
      }
    },
    handleClickUserDropdown (name) { // 用户菜单点击
      if (name === 'ownSpace') {
        this.$store.dispatch('increateTag', {title: '个人中心', path: '', name: 'ownspace'})
        this.$router.push({
          name: 'ownspace'
        })
      } else if (name === 'editPassword') {
        this.modalPassword = true
      } else if (name === 'loginout') {
        this.$store.commit('logout', this)
        this.$router.push({
          name: 'login'
        })
      }
    },
    savePassword: function () { // 保存密码
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
