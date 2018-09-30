<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="addFormData">新增</Button>
    <!-- <Button type="primary" @click="editFormData">修改</Button>
    <Button type="primary" @click="deleteFormData">删除</Button> -->
  </div>
  <Row>
    <Col span="6">
      <Table :height="tableHeight" border :columns="treeColumns" :data="treeData" stripe highlight-row @on-row-click="initTable"></Table>
    </Col>
    <Col span="18">
      <!-- <Tree :data="data" @on-select-change="setPid" ref="treeTable"></Tree> -->
      <tree-grid :items="data" :columns="columns" @on-row-click="rowClick" @on-button-click="buttonClick"></tree-grid>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
import TreeGrid from '../../components/treeGrid2.0.vue'
export default {
  components: {
    TreeGrid
  },
  data () {
    return {
      tableName: '', // 表单名
      formObj: {}, // 表单对象
      columns: [],
      data: [],
      treeColumns: [
        {
          title: '表单名',
          key: 'name',
          align: 'center'
        }
      ],
      treeData: [], // 树形表数据
      pid: 0, // 父ID
      CurrentEditData: {} // 选中数据
    }
  },
  computed: {
    tableHeight: function () { // 表格高度
      return document.body.clientHeight - 210
    }
  },
  methods: {
    addFormData: function () { // 新增数据
      if (this.tableName === '') {
        this.$Message.error('请先选择表单')
      } else {
        this.$store.dispatch('setCurrentEditForm', this.formObj)
        this.$router.push({
          name: 'addTreeFormData',
          params: {tableName: this.tableName, pid: this.pid}
        })
      }
    },
    viewFormData: function (data) { // 查看数据
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$store.dispatch('setCurrentEditFormData', data)
      this.$router.push({
        name: 'viewTreeFormData',
        params: {tableName: this.tableName, id: data.id}
      })
    },
    editFormData: function (data) { // 修改数据
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$store.dispatch('setCurrentEditFormData', data)
      this.$router.push({
        name: 'editTreeFormData',
        params: {tableName: this.tableName, id: data.id}
      })
    },
    deleteFormData: function (data) { // 删除数据
      this.$Modal.confirm({
        title: '',
        content: '确认删除此数据？',
        onOk: () => {
          this.$api.post('/crm/ActionFormUtil/delete.do', {tableName: this.tableName, id: data.id}, r => {
            if (r.data === '0') {
              this.$Message.error('删除数据失败')
            } else {
              this.$Message.success('删除数据成功')
              this.init()
              this.data = []
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    init: function () {
      this.$api.post('/crm/ActionFormUtil/getByType.do', {type: 2}, r => { // 获取树形表单
        this.treeData = r.data
      })
    },
    initTable: function (row, index) {  // 点击表单初始化表单数据
      this.formObj = JSON.parse(row.str_json)
      this.tableName = row.title
      this.columns = [
        {
          type: 'selection',
          width: '50',
          align: 'center'
        }
      ]
      this.initColumns(this.formObj.field)
      this.$api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: this.tableName}, r => {
        this.data = Util.dataConvertForTree(r.data, this.formObj.treeField)
      })
    },
    setPid: function (row) { // 点击数据设置父ID
      this.pid = row[0].id
      this.CurrentEditData = row[0]
    },
    buttonClick: function (data, index, event, text) { // 点击按钮
      if (text === '查看') {
        this.viewFormData(data)
      } else if (text === '修改') {
        this.editFormData(data)
      } else if (text === '删除') {
        this.deleteFormData(data)
      }
    },
    rowClick: function (data, index, event) { // 点击一行
      this.pid = data.id
    },
    /* selectionClick: function (arr) { // 点击数据设置父ID
      this.pid = arr
    }, */
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
      this.columnsAddAction()
    },
    columnsAddAction: function () { // 表头加操作列
      this.columns.push({
        title: '操作',
        type: 'action',
        width: 150,
        align: 'center',
        actions: [{
          type: 'success',
          text: '查看'
        }, {
          type: 'primary',
          text: '修改'
        }, {
          type: 'error',
          text: '删除'
        }]
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
