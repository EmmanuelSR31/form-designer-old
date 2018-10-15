import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  user: {id: '1035'}, // 用户
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
      title: '月份选择器',
      fieldType: 'monthbox'
    },
    {
      title: '年份选择器',
      fieldType: 'yearbox'
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
  columnAlign: [ // 表头对齐方式
    {
      text: '左对齐',
      value: 'left'
    },
    {
      text: '居中',
      value: 'center'
    },
    {
      text: '右对齐',
      value: 'right'
    }
  ],
  searchManner: [ // 搜索方式
    {
      text: '并且',
      value: 'and'
    },
    {
      text: '或者',
      value: 'or'
    }
  ],
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
    },
    {
      type: 'monthbox',
      text: '月份框'
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
  ],
  positionList: [], // 用户职位列表
  userStatusList: [], // 用户状态列表
  urlInParaCondition: [ // 链接输入参数条件列表
    {
      text: '包含',
      value: 'like'
    },
    {
      text: '等于',
      value: '='
    },
    {
      text: '大于',
      value: '>'
    },
    {
      text: '小于',
      value: '<'
    },
    {
      text: '日期大于等于',
      value: 'date>='
    },
    {
      text: '日期小于等于',
      value: 'date<='
    }
  ],
  urlInParaValue: [ // 引用下拉输入参数值列表
    {
      text: '用户ID',
      value: 'userId'
    }
  ],
  chartFieldCalculateType: [ // 图表字段计算方式
    {
      text: '求和',
      value: 'sum'
    },
    {
      text: '计数',
      value: 'count'
    }
  ],
  chartType: [ // 图表类型
    {
      type: 'line',
      title: '折线图',
      icon: 'chart-icon-line'
    },
    {
      type: 'bar',
      title: '柱状图',
      icon: 'chart-icon-bar'
    },
    {
      type: 'pie',
      title: '饼图',
      icon: 'chart-icon-pie'
    },
    {
      type: 'gauge',
      title: '仪表盘',
      icon: 'chart-icon-gauge'
    }
  ],
  chartCondition: [ // 图表搜索条件
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
      text: '为空',
      value: 'isEmpty'
    },
    {
      text: '不为空',
      value: 'notEmpty'
    }
  ],
  chartDateCondition: [ // 图表日期筛选项
    {
      name: '今天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '1',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '昨天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '1',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '最近7天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '7',
        granularity: 'day',
        end: '1'
      }
    },
    {
      name: '最近30天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '30',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '最近90天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '90',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '最近365天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '365',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    }
  ],
  chartColorTheme: [ // 图表配色
    {
      name: '默认12',
      colors: ['rgb(81, 130, 228)', 'rgb(155, 204, 102)', 'rgb(63, 178, 126)', 'rgb(247, 203, 74)', 'rgb(248, 141, 72)', 'rgb(243, 83, 82)', 'rgb(206, 98, 214)',
        'rgb(137, 84, 212)', 'rgb(81, 86, 184)', 'rgb(81, 180, 241)', 'rgb(105, 212, 219)', 'rgb(212, 45, 107)']
    }
  ],
  gaugeConditions: [ // 图表配色
    {
      min: '0',
      max: '0.2',
      color: 'rgb(145, 199, 174)'
    },
    {
      min: '0.2',
      max: '0.8',
      color: 'rgb(99, 134, 158)'
    },
    {
      min: '0.8',
      max: '1',
      color: 'rgb(194, 53, 49)'
    }
  ],
  gaugeConditionsColors: [ // 仪表盘配置颜色
    'rgb(81, 130, 228)', 'rgb(155, 204, 102)', 'rgb(63, 178, 126)', 'rgb(247, 203, 74)', 'rgb(248, 141, 72)', 'rgb(243, 83, 82)', 'rgb(206, 98, 214)',
    'rgb(137, 84, 212)', 'rgb(81, 86, 184)', 'rgb(81, 180, 241)', 'rgb(105, 212, 219)', 'rgb(212, 45, 107)'
  ]
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
