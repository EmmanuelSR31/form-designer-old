import Main from '@/page/main.vue'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => { require(['@/page/login.vue'], resolve) }
}

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: resolve => { require(['@/page/error-page/404.vue'], resolve) }
}

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: resolve => { require(['@/page/error-page/403.vue'], resolve) }
}

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: resolve => { require(['@/page/error-page/500.vue'], resolve) }
}

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  children: [
    { path: 'home', title: {i18n: 'home'}, name: 'home', component: resolve => { require(['@/page/home/home.vue'], resolve) } },
    { path: 'ownspace', title: '个人中心', name: 'ownspace', component: resolve => { require(['@/page/own-space/own-space.vue'], resolve) } },
    // { path: 'addForm', title: '新增表单', name: 'addForm', component: resolve => { require(['@/page/form/addForm.vue'], resolve) } },
    { path: 'editForm/:method', title: '修改表单', name: 'editForm', component: resolve => { require(['@/page/form/editForm.vue'], resolve) } },
    { path: 'editFormAttr', title: '配置表单', name: 'editFormAttr', component: resolve => { require(['@/page/form/editFormAttr.vue'], resolve) } },
    { path: 'formDataManage/:tableName', title: '栏目数据管理', name: 'formDataManage', component: resolve => { require(['@/page/form/formDataManage.vue'], resolve) } },
    // { path: 'addFormData/:tableName/:pid', title: '新增数据', name: 'addFormData', component: resolve => { require(['@/page/form/addFormData.vue'], resolve) } },
    { path: 'editFormData/:tableName/:id/:pid/:method', title: '修改数据', name: 'editFormData', component: resolve => { require(['@/page/form/editFormData.vue'], resolve) } },
    // { path: 'viewFormData/:tableName/:id', title: '查看数据', name: 'viewFormData', component: resolve => { require(['@/page/form/viewFormData.vue'], resolve) } },
    { path: 'childTableManage/:tableName/:recordID', title: '子表数据管理', name: 'childTableManage', component: resolve => { require(['@/page/form/childTable/childTableManage.vue'], resolve) } },
    // { path: 'addChildFormData/:tableName/:recordID', title: '新增子表数据', name: 'addChildFormData', component: resolve => { require(['@/page/form/childTable/addChildFormData.vue'], resolve) } },
    { path: 'editChildFormData/:tableName/:id/:recordID/:method', title: '修改子表数据', name: 'editChildFormData', component: resolve => { require(['@/page/form/childTable/editChildFormData.vue'], resolve) } },
    // { path: 'viewChildFormData/:tableName/:id/:recordID', title: '查看子表数据', name: 'viewChildFormData', component: resolve => { require(['@/page/form/childTable/viewChildFormData.vue'], resolve) } },
    { path: 'filesManage/:field/:paths', title: '附件上传', name: 'filesManage', component: resolve => { require(['@/page/form/fileManage/filesManage.vue'], resolve) } },
    // { path: 'addUrl/:pid', title: '新增URL', name: 'addUrl', component: resolve => { require(['@/page/urlManage/addUrl.vue'], resolve) } },
    { path: 'editUrl', title: '修改URL', name: 'editUrl', component: resolve => { require(['@/page/urlManage/editUrl.vue'], resolve) } },
    { path: 'addTreeFormData/:tableName/:pid', title: '新增数据', name: 'addTreeFormData', component: resolve => { require(['@/page/form/treeManage/addTreeFormData.vue'], resolve) } },
    { path: 'editTreeFormData/:tableName/:id', title: '修改数据', name: 'editTreeFormData', component: resolve => { require(['@/page/form/treeManage/editTreeFormData.vue'], resolve) } },
    { path: 'viewTreeFormData/:tableName/:id', title: '查看数据', name: 'viewTreeFormData', component: resolve => { require(['@/page/form/treeManage/viewTreeFormData.vue'], resolve) } },
    { path: 'addChart/:tableName', title: '新增图表', name: 'addChart', component: resolve => { require(['@/page/chartsManage/addChart.vue'], resolve) } },
    { path: 'editChart/:id', title: '修改图表', name: 'editChart', component: resolve => { require(['@/page/chartsManage/editChart.vue'], resolve) } },
    { path: 'formChart/:tableName', title: '表单图表', name: 'formChart', component: resolve => { require(['@/page/chartsManage/formChart.vue'], resolve) } }
  ]
}

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
  {
    path: '/form',
    icon: 'md-alert',
    name: 'form',
    title: '表单',
    component: Main,
    children: [
      {
        path: '/form',
        title: '表单',
        name: 'form',
        component: resolve => { require(['@/page/form/form.vue'], resolve) }
      },
      {
        path: '/formManage',
        title: '表单管理',
        name: 'formManage',
        component: resolve => { require(['@/page/form/formManage.vue'], resolve) }
      }
    ]
  },
  {
    path: '/chart',
    icon: 'md-alert',
    name: 'chart',
    title: '图表',
    component: Main,
    children: [
      {
        path: '/lineChart',
        icon: 'compose',
        name: 'lineChart',
        title: '折线图',
        component: resolve => { require(['@/page/chart/lineChart.vue'], resolve) }
      },
      {
        path: '/barChart',
        icon: 'compose',
        name: 'barChart',
        title: '柱状图',
        component: resolve => { require(['@/page/chart/barChart.vue'], resolve) }
      }
    ]
  },
  {
    path: '/selectManage',
    icon: 'md-cog',
    name: 'selectManage',
    title: '系统管理',
    component: Main,
    children: [
      {
        path: '/selectManage',
        icon: 'compose',
        name: 'selectManage',
        title: '下拉框管理',
        component: resolve => { require(['@/page/selectManage/selectManage.vue'], resolve) }
      },
      {
        path: '/urlManage',
        icon: 'compose',
        name: 'urlManage',
        title: '链接管理',
        component: resolve => { require(['@/page/urlManage/urlManage.vue'], resolve) }
      },
      {
        path: '/treeFormDataManage',
        icon: 'compose',
        name: 'treeFormDataManage',
        title: '树形表管理',
        component: resolve => { require(['@/page/form/treeManage/treeFormDataManage.vue'], resolve) }
      },
      {
        path: '/chartsManage',
        icon: 'compose',
        name: 'chartsManage',
        title: '图表管理',
        component: resolve => { require(['@/page/chartsManage/chartsManage.vue'], resolve) }
      },
      {
        path: '/systemSet',
        icon: 'compose',
        name: 'systemSet',
        title: '系统名称设置',
        component: resolve => { require(['@/page/system/systemSet.vue'], resolve) }
      },
      {
        path: '/menuManage',
        icon: 'compose',
        name: 'menuManage',
        title: '菜单管理',
        component: resolve => { require(['@/page/menuManage/menuManage.vue'], resolve) }
      },
      {
        path: '/userManage',
        icon: 'compose',
        name: 'userManage',
        title: '用户管理',
        component: resolve => { require(['@/page/userManage/userManage.vue'], resolve) }
      },
      {
        path: '/fileList',
        icon: 'compose',
        name: 'fileList',
        title: '上传管理',
        component: resolve => { require(['@/page/form/fileManage/fileList.vue'], resolve) }
      },
      {
        path: '/positionManage',
        icon: 'compose',
        name: 'positionManage',
        title: '职位管理',
        component: resolve => { require(['@/page/position/positionManage.vue'], resolve) }
      },
      {
        path: '/workbenchConfig',
        icon: 'compose',
        name: 'workbenchConfig',
        title: '工作台设置',
        component: resolve => { require(['@/page/system/workbenchConfig.vue'], resolve) }
      },
      {
        path: '/processInstanceList',
        icon: 'compose',
        name: 'processInstanceList',
        title: '流程监控部署管理',
        component: resolve => { require(['@/page/flow/processInstanceList.vue'], resolve) }
      },
      {
        path: '/profFromRelList',
        icon: 'compose',
        name: 'profFromRelList',
        title: '模型表单关系管理',
        component: resolve => { require(['@/page/flow/profFromRel/profFromRelList.vue'], resolve) }
      }
    ]
  },
  {
    path: '/flowManager',
    icon: 'md-folder',
    name: 'flowManager',
    title: '任务',
    component: Main,
    children: [
      {
        path: '/flowManager',
        title: '个人任务',
        name: 'flowManager',
        component: resolve => { require(['@/page/flow/flowManager.vue'], resolve) }
      }
    ]
  }
]

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
  page500,
  page403,
  page404
]
