<template>
<div>
  <Row>
    <Col :sm="12">
      <Card>
        <div class="table-search-con">
          <Button type="primary" @click="search">查询</Button>
        </div>
        <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe highlight-row></Table>
        <div class="page-con">
          <Page :total="totalRows" :current="currentPage" :page-size="pageSize" placement="top" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
        </div>
      </Card>
    </Col>
    <Col :sm="12">
      <Card>
        <Tabs>
          <TabPane label="运行中实例与任务">
              <Table :height="tableHeight/2" border :loading="loadingRunning" :columns="columnsRunning" :data="dataRunning" stripe highlight-row></Table>
              <div class="page-con">
                <Page :total="totalRowsRunning" :current="currentPageRunning" :page-size="pageSizeRunning" placement="top" @on-change="changePageRunning" @on-page-size-change="changePageSizeRunning" show-elevator show-sizer></Page>
              </div>
          </TabPane>
          <TabPane label="历史实例与任务">标签二的内容</TabPane>
        </Tabs>
      </Card>
    </Col>
  </Row>
  
  
  
</div>
</template>
<script>
export default {
  data () {
    return {
      loading: false, // 加载中
      loadingRunning: false, // 运行中实例加载中
      currentPage: 1, // 当前页码
      currentPageRunning: 1, // 当前页码
      pageSize: 10, // 每页显示数
      pageSizeRunning: 10, // 每页显示数
      totalRows: 0, // 数据总数
      totalRowsRunning: 0, // 数据总数
      columns: [
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '模板名称',
          key: 'name'
        },
        {
          title: '模板key',
          key: 'key'
        },
        {
          title: '版本',
          key: 'version'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('a', {
                attrs: {
                  title: '开启当前流程模版新的流程实例'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.editFormData(params)
                  }
                }
              }, [h('Icon', {props: {type: 'md-arrow-dropright-circle', size: 20, color: 'green'}})]
              ),
              h('a', {
                attrs: {
                  title: '查看当前流程模版的流程图'
                },
                style: {
                  marginRight: '8px'
                },
                on: {
                  click: () => {
                    this.viewFile(params)
                  }
                }
              }, [h('Icon', {props: {type: 'md-eye', size: 20, color: 'blue'}})]
              ),
              h('a', {
                attrs: {
                  title: '删除当前流程模版'
                },
                on: {
                  click: () => {
                    this.delFile(params)
                  }
                }
              }, [h('Icon', {props: {type: 'md-close', size: 20, color: 'red'}})]
              )
            ])
          }
        }
      ],
      columnsRunning: [
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: '编号',
          key: 'id'
        },
        {
          title: '模板名称',
          key: 'name'
        },
        {
          title: '模板key',
          key: 'key'
        },
        {
          title: '版本',
          key: 'version'
        },
        {
          title: '创建时间',
          key: 'createDate'
        },
        {
          title: '描述',
          key: 'description'
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
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
                    this.editFormData(params)
                  }
                }
              }, '修改'),
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
                    this.viewFile(params)
                  }
                }
              }, '预览'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.delFile(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [],
      dataRunning: []
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
      this.$api.post('/upload/getFilelist', {rows: this.pageSize, page: this.currentPage}, r => {
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
    viewFile: function (params) { // 预览图片
      this.viewFlag = true
      if (params.row.fileType === '.pdf') {
        this.pdfSrc = 'http://27.221.114.82:9003' + params.row.filePath
      } else {
        this.imgSrc = 'http://27.221.114.82:9003' + params.row.filePath
      }
    },
    closeView: function () { // 关闭预览
      this.viewFlag = false
    },
    delFile: function (params) { // 删除附件
      this.$Modal.confirm({
        title: '',
        content: '确认删除此附件？',
        onOk: () => {
          this.$api.post('/upload/deleteFile', {filePath: params.row.filePath, id: params.row.id}, r => {
            this.$Message.info(r.data.msg)
            this.changePage(this.currentPage)
          })
        },
        onCancel: () => {
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>