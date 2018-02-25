<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="addFormData">新增</Button>
  </div>
  <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe></Table>
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
      tableName: this.$route.params.tableName, // 表单名
      formObj: {}, // 表单对象
      loading: true, // 加载中
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示数
      totalRows: 0, // 数据总数
      columns: [],
      data: [],
      selectData: this.$store.state.selectData // 下拉数据
    }
  },
  computed: {
    tableHeight: function () { // 表格高度
      return document.body.clientHeight - 210
    }
  },
  methods: {
    changePage: function (current) { // 改变页码
      this.currentPage = current
      this.$api.post('/crm/ActionFormUtil/getByTableName.do', {rows: this.pageSize, page: this.currentPage, tableName: this.tableName}, r => {
        this.totalRows = r.data.total
        this.data = r.data.rows
        this.loading = false
      })
    },
    changePageSize: function (size) { // 改变每页显示数
      this.pageSize = size
      this.changePage(this.currentPage)
    },
    addFormData: function () { // 新增数据
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$router.push({
        name: 'addFormData',
        params: {tableName: this.tableName}
      })
    },
    viewFormData: function (params) { // 查看数据
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$store.dispatch('setCurrentEditFormData', params.row)
      this.$router.push({
        name: 'viewFormData',
        params: {tableName: this.tableName, id: params.row.id}
      })
    },
    editFormData: function (params) { // 修改数据
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$store.dispatch('setCurrentEditFormData', params.row)
      this.$router.push({
        name: 'editFormData',
        params: {tableName: this.tableName, id: params.row.id}
      })
    },
    deleteFormData: function (params) { // 删除数据
      this.$Modal.confirm({
        title: '',
        content: '确认删除此数据？',
        onOk: () => {
          this.$api.post('/crm/ActionFormUtil/delete.do', {tableName: this.tableName, id: params.row.id}, r => {
            if (r.data === '0') {
              this.$Message.error('删除数据失败')
            } else {
              this.$Message.success('删除数据成功')
              this.changePage(this.currentPage)
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    init: function () {
      this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.tableName}, r => {
        this.formObj = r.data
        this.initColumns(r.data.field)
      })
      this.changePage(this.currentPage)
    },
    initColumns: function (fields) { // 生成表格列
      this.columns = []
      this.columns.push({
        type: 'index',
        title: '序列',
        width: 50,
        align: 'center'
      })
      for (let variable of fields) {
        if (variable.listDisplay === 'true' || variable.listDisplay) {
          if (variable.fieldType === 'tablebox') {
            this.columns.push({
              title: variable.title,
              key: variable.text,
              width: 80,
              align: 'center',
              render: (h, params) => {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.childTableManage(params, variable.tableTitle)
                    }
                  }
                }, '查看详情')
              }
            })
          } else if (variable.fieldType === 'combobox') {
            this.columns.push({
              title: variable.title,
              key: variable.text,
              width: 80,
              align: 'center',
              render: (h, params) => {
                let fieldText = params.column.key
                let selectId = variable.selectID
                let valueTemp = ''
                if (!Util.isEmpty(params.row[fieldText]) && !Util.isEmpty(this.selectData[selectId])) {
                  let valueTemp1 = this.selectData[selectId].find(function (value, index, arr) {
                    if (value.id.toString() === params.row[fieldText]) {
                      return value
                    }
                  })
                  if (!Util.isEmpty(valueTemp1)) {
                    valueTemp = valueTemp1.text
                  }
                }
                return h('div', valueTemp)
              }
            })
          } else {
            this.columns.push({
              title: variable.title,
              key: variable.text
            })
          }
        }
      }
      this.columns.push({
        title: '操作',
        key: 'action',
        width: 150,
        align: 'center',
        render: (h, params) => {
          return h('div', [
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
                  this.viewFormData(params)
                }
              }
            }, '查看'),
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
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.deleteFormData(params)
                }
              }
            }, '删除')
          ])
        }
      })
    },
    childTableManage: function (params, tableTitle) { // 管理子表数据
      this.$router.push({
        name: 'childTableManage',
        params: {tableName: tableTitle, recordID: params.row.uuid}
      })
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    '$route' (to, from) {
      this.tableName = to.params.tableName
      this.init()
    }
  }
}
</script>
