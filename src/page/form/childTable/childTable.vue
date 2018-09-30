<template>
<div>
  <div v-if="!isView" class="table-search-con">
    <Button type="primary" @click="addFormData">新增</Button>
  </div>
  <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe></Table>
</div>
</template>
<script>
import Util from '@/utils/index'
import addChildFormData from './addChildFormData.vue'
import editChildFormData from './editChildFormData.vue'
import viewChildFormData from './viewChildFormData.vue'
export default {
  name: 'childTable',
  props: {
    childTableName: String, // 表单名
    recordID: String, // 主表数据ID
    isView: Boolean // 是否查看
  },
  data () {
    return {
      formObj: {}, // 表单对象
      loading: true, // 加载中
      currentPage: 1, // 当前页码
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
      this.$api.post('/crm/ActionFormUtil/getDataByUuid.do', {tableName: this.childTableName, uuid: this.recordID}, r => {
        this.totalRows = r.data.total
        this.data = r.data.rows
        this.loading = false
      })
    },
    addFormData: function () { // 新增数据
      this.$store.dispatch('setCurrentEditChildForm', this.formObj)
      this.$layer.open({
        type: 2,
        content: {
          content: addChildFormData, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            tableName: this.childTableName,
            recordID: this.recordID
          }
        },
        shadeClose: false,
        shade: false,
        maxmin: true,
        btn: '保存',
        area: [document.body.clientWidth - 100 + 'px', document.body.clientHeight - 20 + 'px'],
        title: '新增数据',
        yes: function (index) {
          var ifname = 'layui-layer-iframe' + index
          var Ifame = window.frames[ifname]
          Ifame.save()
        }
      })
    },
    editFormData: function (params) { // 修改数据
      this.$store.dispatch('setCurrentEditChildForm', this.formObj)
      this.$store.dispatch('setCurrentEditChildFormData', params.row)
      this.$layer.open({
        type: 2,
        content: {
          content: editChildFormData, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            tableName: this.childTableName,
            recordID: this.recordID,
            id: params.row.id
          }
        },
        shadeClose: false,
        shade: false,
        maxmin: true,
        area: [document.body.clientWidth - 100 + 'px', document.body.clientHeight - 20 + 'px'],
        title: '修改数据'
      })
    },
    viewFormData: function (params) { // 查看数据
      this.$store.dispatch('setCurrentEditChildForm', this.formObj)
      this.$store.dispatch('setCurrentEditChildFormData', params.row)
      this.$layer.open({
        type: 2,
        content: {
          content: viewChildFormData, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            tableName: this.childTableName,
            recordID: this.recordID,
            id: params.row.id
          }
        },
        shadeClose: false,
        shade: false,
        maxmin: true,
        area: [document.body.clientWidth - 100 + 'px', document.body.clientHeight - 20 + 'px'],
        title: '查看数据'
      })
    },
    deleteFormData: function (params) { // 删除数据
      this.$Modal.confirm({
        title: '',
        content: '确认删除此数据？',
        onOk: () => {
          this.$api.post('/crm/ActionFormUtil/delete.do', {tableName: this.childTableName, id: params.row.id}, r => {
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
      this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.childTableName}, r => {
        this.formObj = r.data
        Util.initFormQuoteSelectData(this.formObj.field)
        this.initColumns(r.data.field)
      })
      this.changePage(this.currentPage)
    },
    initColumns: function (fields) { // 生成表格列
      this.columns = []
      this.columns.push({
        type: 'index',
        title: '序列',
        width: 64,
        align: 'center'
      })
      for (let variable of fields) {
        if ((variable.listDisplay === 'true' || variable.listDisplay === true) && variable.text !== 'record_id') {
          if (variable.fieldType === 'combobox') {
            this.columns.push(Util.comboboxColumns(variable, this.selectData))
          } else if (variable.fieldType === 'filebox') {
            this.columns.push(Util.fileColumns(variable))
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
    cancel: function () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
