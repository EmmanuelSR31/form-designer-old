<template>
<div>
  <div class="table-search-con">
    <Input v-model="searchName" placeholder="任务名称" style="width:200px;"></Input>
    <Button type="primary" @click="search">查询</Button>
  </div>
  <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe highlight-row></Table>
  <div class="page-con">
    <Page :total="totalRows" :current="currentPage" :page-size="pageSize" placement="top" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
  </div>
</div> 
</template>
<script>
import Util from '@/utils/index'
export default {
  data () {
    return {
      loading: false, // 加载中
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示数
      totalRows: 0, // 数据总数
      columns: [
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: '任务编号',
          key: 'id'
        },
        {
          title: '流程日期',
          key: 'flowDate'
        },
        {
          title: '流程名称',
          key: 'title'
        },
        {
          title: '发起人',
          key: 'cretePerson'
        },
        {
          title: '当前环节',
          key: 'taskName'
        },
        {
          title: '办理人',
          key: 'assignee'
        },
        {
          title: '任务状态',
          key: 'state',
          render: (h, params) => {
            return h('div', Util.flowStateFormat(params.row.state))
          }
        },
        {
          title: '流程创建时间',
          key: 'ulfoCreateDate'
        },
        {
          title: '任务创建时间',
          key: 'createDate'
        },
        {
          title: '前置任务',
          key: 'prevTask'
        },
        {
          title: '下一节点名称',
          key: 'nextNode'
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.approveTask(params)
                  }
                }
              }, '办理任务'),
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showPic(params)
                  }
                }
              }, '查看任务进度')
            ])
          }
        }
      ],
      data: [],
      searchName: '' // 搜索名称
    }
  },
  computed: {
    tableHeight: function () { // 表格高度
      return document.body.clientHeight - 210
    }
  },
  methods: {
    init: function () {
      this.changePage(this.currentPage)
    },
    changePage: function (current) { // 改变页码
      this.loading = true
      this.currentPage = current
      this.$api.get('/flow/loadTodo?rows=' + this.pageSize + '&page=' + this.currentPage, {}, r => {
        console.log(r)
        this.totalRows = r.data.total
        this.data = r.data.rows
        this.loading = false
      })
    },
    changePageSize: function (size) { // 改变每页显示数
      this.pageSize = size
      this.changePage(this.currentPage)
    },
    search: function () { // 查询

    },
    approveTask: function (params) { // 办理任务
      let url = ''
      let title = ''
      let uuid = ''
      let todoTaskPath = params.row.url
      let tableName = todoTaskPath.substr(0, todoTaskPath.indexOf('.'))
      if (todoTaskPath === '/flow/approve') {
        url = 'seeFormOrder'
        title = params.row.firUrl
        uuid = params.row.firBusinessId
      } else {

      }
      this.$api.post('/flow/canWithDraw', {taskId: params.row.id}, r => {
        console.log(r)
      })
      return url + title + uuid + tableName
    },
    showPic: function (params) { // 查看任务进度

    }
  },
  mounted () {
    this.init()
  }
}
</script>
