import * as types from './mutation-types'
import Util from '@/utils/index'
import {appRouter} from '@/router/router'
import api from '@/api/index.js'

export default {
  [types.LOGOUT] (state) { // 退出登录
    localStorage.clear()
  },
  [types.INCREATE_TAG] (state, tagObj) { // 添加标签
    if (!Util.oneOf(tagObj.name, state.dontCache)) {
      state.cachePage.push(tagObj.name)
      localStorage.cachePage = JSON.stringify(state.cachePage)
    }
    if (!Util.oneOf(tagObj, state.pageOpenedList)) {
      state.pageOpenedList.push(tagObj)
      localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
    }
    state.currentPageName = tagObj.name
  },
  [types.UPDATE_MENULIST] (state) { // 更新菜单
    let menuList = []
    appRouter.forEach((item, index) => {
      if (item.children.length === 1) {
        menuList.push(item)
      } else {
        let len = menuList.push(item)
        let childrenArr = []
        childrenArr = item.children
        let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]))
        handledItem.children = childrenArr
        menuList.splice(len - 1, 1, handledItem)
      }
    })
    let menuTemp = {
      icon: 'key',
      name: 'userDefined',
      path: '/userDefined',
      title: '栏目',
      children: []
    }
    api.post('/crm/ActionFormUtil/getByType.do', {type: 0}, r => {
      for (let variable of r.data) {
        if (variable.type === '0') {
          menuTemp.children.push({
            name: 'formDataManage/' + variable.title,
            path: '/formDataManage/' + variable.title,
            title: variable.name
          })
        }
      }
    })
    menuList.push(menuTemp)
    state.menuList = menuList
  },
  [types.SET_CURRENTPAGENAME] (state, name) { // 设置当前页面
    state.currentPageName = name
  },
  [types.REMOVE_TAG] (state, name) { // 删除标签
    state.pageOpenedList.map((item, index) => {
      if (item.name === name) {
        state.pageOpenedList.splice(index, 1)
      }
    })
  },
  [types.CLOSE_PAGE] (state, name) { // 从缓存页面中删除页面
    state.cachePage.forEach((item, index) => {
      if (item === name) {
        state.cachePage.splice(index, 1)
      }
    })
  },
  [types.CLOSE_CURRENT_TAG] (state) { // 关闭所有标签
    let currentIndex = 0
    state.pageOpenedList.forEach((item, index) => {
      if (item.name === state.contextMenuOpenedTag) {
        currentIndex = index
      }
    })
    state.pageOpenedList.splice(currentIndex, 1)
    state.cachePage.splice(currentIndex, 1)
    localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  [types.CLOSE_OTHER_TAGS] (state) { // 关闭其他标签
    let currentIndex = 0
    state.pageOpenedList.forEach((item, index) => {
      if (item.name === state.contextMenuOpenedTag) {
        currentIndex = index
      }
    })
    if (currentIndex === 0) {
      state.pageOpenedList.splice(1)
    } else {
      state.pageOpenedList.splice(currentIndex + 1)
      state.pageOpenedList.splice(1, currentIndex - 1)
    }
    let newCachepage = state.cachePage.filter(item => {
      return item === state.contextMenuOpenedTag
    })
    state.cachePage = newCachepage
    localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  [types.CLOSE_ALL_TAGS] (state) { // 关闭所有标签
    state.pageOpenedList.splice(1)
    state.cachePage.length = 0
    localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  [types.SET_CONTEXTMENUOPENEDTAG] (state, name) { // 设置打开右键菜单的标签
    state.contextMenuOpenedTag = name
  },
  [types.SET_CURRENTEDITFORM] (state, formObj) { // 设置当前修改表单
    state.currentEditForm = formObj
  },
  [types.SET_CURRENTEDITFORMDATA] (state, dataObj) { // 设置当前修改数据
    state.currentEditFormData = dataObj
  },
  [types.SET_CURRENTEDITCHILDFORM] (state, formObj) { // 设置当前修改表单
    state.currentEditChildForm = formObj
  },
  [types.SET_CURRENTEDITCHILDFORMDATA] (state, dataObj) { // 设置当前修改数据
    state.currentEditChildFormData = dataObj
  },
  [types.SET_SELECTDATA] (state) { // 设置下拉数据
    api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: 'table_manage_select'}, r => {
      for (let variable of r.data.rows) {
        api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: variable.table_name}, rs => {
          state.selectData[variable.table_name] = rs.data.rows
        })
      }
      state.normalSelect = r.data.rows
    })
    api.post('/develop/url/getAllUrl.do', {}, r => {
      for (let variable of r.data) {
        api.post('/develop/url/getUrl.do', {name: variable.name}, rs => {
          state.selectData[variable.name] = rs.data
        })
      }
      state.quoteSelect = r.data
    })
  }
}
