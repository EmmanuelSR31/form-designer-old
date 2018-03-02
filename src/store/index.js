import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  menuList: [], // 左侧菜单列表
  cachePage: [], // 缓存页面
  leftMenuTheme: 'dark', // 左侧菜单主题
  openedSubmenu: '', // 左侧菜单打开项
  pageOpenedList: [{ // 打开页面列表
    title: '首页',
    path: '',
    name: 'home'
  }],
  currentPageName: 'home', // 当前页面名
  currentPath: [ // 当前页面路径
    {
      title: '首页',
      path: '',
      name: 'home'
    }
  ],
  dontCache: [], // 在这里定义你不想要缓存的页面的name属性值
  contextMenuList: [ // 标签右键菜单
    {
      name: 'close',
      title: '关闭当前'
    },
    {
      name: 'closeOther',
      title: '关闭其他'
    },
    {
      name: 'closeAll',
      title: '关闭所有'
    }
  ],
  contextMenuOpenedTag: '', // 打开右键菜单的标签
  controlArray: [ // 字段类型列表
    {
      title: '文本输入框',
      fieldType: 'textbox'
    },
    {
      title: '多行文本输入框',
      fieldType: 'textboxMultiline',
      height: 64
    },
    {
      title: '数字输入框',
      fieldType: 'numberbox'
    },
    {
      title: '下拉选择器',
      fieldType: 'combobox'
    },
    {
      title: '单选框',
      fieldType: 'radio',
      radios: ['单选框']
    },
    {
      title: '多选框',
      fieldType: 'checkbox',
      checkboxs: ['多选框']
    },
    {
      title: '开关选择器',
      fieldType: 'switch'
    },
    {
      title: '日期选择器',
      fieldType: 'datebox'
    },
    {
      title: '日期时间选择器',
      fieldType: 'datetimebox'
    },
    {
      title: '子表',
      fieldType: 'tablebox'
    },
    {
      title: '附件上传',
      fieldType: 'filebox'
    }
  ],
  currentEditForm: {}, // 当前修改表单
  currentEditFormData: {}, // 当前修改数据
  currentEditChildForm: {}, // 当前修改子表表单
  currentEditChildFormData: {}, // 当前修改子表数据
  selectData: {}, // 下拉数据
  normalSelect: [], // 普通下拉
  quoteSelect: [], // 引用下拉
  searchInputType: [ // 搜索输入框类型
    {
      type: 'textbox',
      text: '文本框'
    },
    {
      type: 'combobox',
      text: '下拉框'
    },
    {
      type: 'datebox',
      text: '日期框'
    }
  ],
  searchCondition: [ // 搜索条件
    {
      text: '包含',
      value: 'like'
    },
    {
      text: '不包含',
      value: 'not like'
    },
    {
      text: '等于',
      value: '='
    },
    {
      text: '不等于',
      value: '<>'
    },
    {
      text: '大于',
      value: '>'
    },
    {
      text: '大于等于',
      value: '>='
    },
    {
      text: '小于',
      value: '<'
    },
    {
      text: '小于等于',
      value: '<='
    },
    {
      text: '是否为空',
      value: 'isEmpty'
    }
  ]
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
