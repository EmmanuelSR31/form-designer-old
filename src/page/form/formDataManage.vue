<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="addFormData">新增</Button>
  </div>
  <Row>
    <Col v-if="formObj.needTree === 'true'" :span="formObj.needTree === 'true' ? 8 : 0">
      <Tree :data="treeData" @on-select-change="setPid" ref="treeTable"></Tree>
    </Col>
    <Col :span="formObj.needTree === 'true' ? 16 : 24">
      <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe></Table>
      <div class="page-con">
        <Page :total="totalRows" :current="currentPage" :page-size="pageSize" placement="top" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
export default {
  data () {
    return {
      tableName: this.$route.params.tableName, // 表单名
      formObj: {}, // 表单对象
      loading: false, // 加载中
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示数
      totalRows: 0, // 数据总数
      columns: [
        {
          type: 'index',
          title: '序列',
          width: 50,
          align: 'center'
        }
      ],
      data: [],
      selectData: this.$store.state.selectData, // 下拉数据
      treeData: [], // 树形表数据
      pid: '', // 父ID
      formAttrObj: {} // 表单配置对象
    }
  },
  computed: {
    tableHeight: function () { // 表格高度
      return document.body.clientHeight - 210
    }
  },
  methods: {
    changePage: function (current) { // 改变页码
      this.loading = true
      this.currentPage = current
      if (this.formObj.needTree === 'true' && this.formObj.treeForm !== '') {
        this.$api.post('/crm/ActionFormUtil/getByTableNameAndPid.do', {rows: this.pageSize, page: this.currentPage, tableName: this.tableName, pid: this.pid}, r => {
          this.totalRows = r.data.total
          this.data = r.data.rows
          this.loading = false
        })
      } else {
        this.$api.post('/crm/ActionFormUtil/getByTableName.do', {rows: this.pageSize, page: this.currentPage, tableName: this.tableName}, r => {
          this.totalRows = r.data.total
          this.data = r.data.rows
          this.loading = false
        })
      }
    },
    changePageSize: function (size) { // 改变每页显示数
      this.pageSize = size
      this.changePage(this.currentPage)
    },
    addFormData: function () { // 新增数据
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      let pid = ''
      if (this.formObj.needTree === 'true' && this.formObj.treeForm !== '') {
        if (this.pid === '') {
          this.$Message.error('请先选择左侧一条数据')
          return false
        } else {
          pid = this.pid
        }
      }
      this.$router.push({
        name: 'addFormData',
        params: {tableName: this.tableName, pid: pid}
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
    setPid: function (row) { // 点击数据设置父ID
      this.pid = row[0].id
      this.currentPage = 1
      this.changePage(this.currentPage)
    },
    init: function () {
      this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.tableName}, r => {
        this.formObj = r.data
        if (this.formObj.needTree === 'true' && this.formObj.treeForm !== '') {
          this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.formObj.treeForm}, r => {
            let treeField = r.data.treeField
            this.$api.post('/crm/ActionFormUtil/getByTableName.do', {rows: this.pageSize, page: this.currentPage, tableName: this.formObj.treeForm}, r => {
              this.treeData = Util.dataConvertForTree(r.data, treeField)
            })
          })
        } else {
          this.changePage(this.currentPage)
        }
        this.$api.post('/pages/button/framework/get.do', {title: this.tableName}, r => {
          if (r.data.obj !== null) {
            this.formAttrObj = r.data.obj
            this.columns.join(JSON.parse(this.formAttrObj.columns))
          } else {
            this.initColumns(r.data.field)
          }
        })
      })
    },
    initColumns: function (fields) { // 生成表格列
      for (let variable of fields) {
        if (variable.listDisplay === 'true' || variable.listDisplay === true) {
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
          } else if (variable.fieldType === 'filebox') {
            this.columns.push({
              title: variable.title,
              key: variable.text,
              render: (h, params) => {
                let temp = params.row[variable.text]
                let files = temp.split(',')
                return h('div', files.map(function (item) {
                  return h('a', {
                    attrs: {
                      href: item,
                      download: item.split('/')[3].substring(36),
                      target: '_blank'
                    }
                  }, item.split('/')[3].substring(36) + ',')
                }))
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
