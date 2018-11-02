import * as types from './mutation-types'
import Util from '@/utils/index'
import {appRouter} from '@/router/router'
import api from '@/api/index.js'

export default {
  /**
  * @desc 退出登录
  */
  [types.LOGOUT] (state) {
    localStorage.clear()
  },
  /**
  * @desc 添加标签
  * @param {Object} tagObj 标签对象
  */
  [types.INCREATE_TAG] (state, tagObj) {
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
  /**
  * @desc 更新菜单
  */
  [types.UPDATE_MENULIST] (state) {
    let menuList = []
    /* api.post('/topJUI/index/getMenu.do', {name: '1', position_id: '9'}, r => {
      menuList = r.data
      for (let iterator of menuList) {
        api.post('/topJUI/index/getMenu.do', {name: iterator.id, position_id: '9'}, rs => {
          iterator.children = rs.data
        })
      }
      state.menuList = menuList
      console.log(menuList)
    }) */
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
      icon: 'md-list',
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
  /**
  * @desc 设置当前页面
  * @param {String} name 页面名
  */
  [types.SET_CURRENTPAGENAME] (state, name) {
    state.currentPageName = name
  },
  /**
  * @desc 删除标签
  * @param {String} name 标签名
  */
  [types.REMOVE_TAG] (state, name) {
    state.pageOpenedList.map((item, index) => {
      if (item.name === name) {
        state.pageOpenedList.splice(index, 1)
      }
    })
  },
  /**
  * @desc 从缓存页面中删除页面
  * @param {String} name 页面名
  */
  [types.CLOSE_PAGE] (state, name) {
    state.cachePage.forEach((item, index) => {
      if (item === name) {
        state.cachePage.splice(index, 1)
      }
    })
  },
  /**
  * @desc 关闭当前标签
  */
  [types.CLOSE_CURRENT_TAG] (state) {
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
  /**
  * @desc 关闭其他标签
  */
  [types.CLOSE_OTHER_TAGS] (state) {
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
  /**
  * @desc 关闭所有标签
  */
  [types.CLOSE_ALL_TAGS] (state) {
    state.pageOpenedList.splice(1)
    state.cachePage.length = 0
    localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  /**
  * @desc 设置打开右键菜单的标签
  * @param {String} name 标签名
  */
  [types.SET_CONTEXTMENUOPENEDTAG] (state, name) {
    state.contextMenuOpenedTag = name
  },
  /**
  * @desc 设置当前修改表单
  * @param {Object} formObj 表单对象
  */
  [types.SET_CURRENTEDITFORM] (state, formObj) {
    state.currentEditForm = formObj
  },
  /**
  * @desc 设置当前修改数据
  * @param {Object} dataObj 数据对象
  */
  [types.SET_CURRENTEDITFORMDATA] (state, dataObj) {
    state.currentEditFormData = dataObj
  },
  /**
  * @desc 设置当前修改子表表单
  * @param {Object} formObj 子表表单对象
  */
  [types.SET_CURRENTEDITCHILDFORM] (state, formObj) {
    state.currentEditChildForm = formObj
  },
  /**
  * @desc 设置当前修改子表数据
  * @param {Object} dataObj 子表数据对象
  */
  [types.SET_CURRENTEDITCHILDFORMDATA] (state, dataObj) {
    state.currentEditChildFormData = dataObj
  },
  /**
  * @desc 设置下拉数据
  */
  [types.SET_SELECTDATA] (state) {
    api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: 'table_manage_select'}, r => {
      for (let variable of r.data.rows) {
        api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: variable.table_name}, rs => {
          state.selectData[variable.table_name] = rs.data.rows
        })
      }
      state.normalSelect = r.data.rows
    })
    api.post('/develop/url/getAllUrl.do', {}, r => {
      /* for (let variable of r.data) {
        api.post('/develop/url/getUrl.do', {name: variable.name}, rs => {
          state.selectData[variable.name] = rs.data
        })
      } */
      state.quoteSelect = r.data
    })
  },
  /**
  * @desc 设置用户职位数据
  */
  [types.SET_POSITIONLIST] (state) {
    api.post('/system/user/position/getAll.do', {}, r => {
      state.positionList = r.data
    })
  },
  /**
  * @desc 设置用户状态数据
  */
  [types.SET_USERSTATUS] (state) {
    api.post('/system/user/userStatus/getAll.do', {}, r => {
      state.userStatusList = r.data
    })
  }
}
