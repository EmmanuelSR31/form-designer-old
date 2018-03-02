<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="addFormData">新增</Button>
    <Button type="primary" @click="editFormData">修改</Button>
    <Button type="primary" @click="deleteFormData">删除</Button>
  </div>
  <Row>
    <Col span="6">
      <Table :height="tableHeight" border :columns="treeColumns" :data="treeData" stripe highlight-row @on-row-click="initTable"></Table>
    </Col>
    <Col span="18">
      <Tree :data="data" @on-select-change="setPid" ref="treeTable"></Tree>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
export default {
  data () {
    return {
      tableName: '', // 表单名
      formObj: {}, // 表单对象
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
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$router.push({
        name: 'addTreeFormData',
        params: {tableName: this.tableName, pid: this.pid}
      })
    },
    viewFormData: function (params) { // 查看数据
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$store.dispatch('setCurrentEditFormData', params.row)
      this.$router.push({
        name: 'viewTreeFormData',
        params: {tableName: this.tableName, id: params.row.id}
      })
    },
    editFormData: function () { // 修改数据
      let node = this.$refs.treeTable.getSelectedNodes()
      delete node[0].children
      delete node[0].nodeKey
      delete node[0].selected
      let flag = true
      for (let iterator of this.formObj.field) {
        if (iterator.text === 'title') {
          flag = false
          break
        }
      }
      if (flag) {
        delete node[0].title
      }
      this.$store.dispatch('setCurrentEditForm', this.formObj)
      this.$store.dispatch('setCurrentEditFormData', node[0])
      this.$router.push({
        name: 'editTreeFormData',
        params: {tableName: this.tableName, id: node[0].id}
      })
    },
    deleteFormData: function () { // 删除数据
      this.$Modal.confirm({
        title: '',
        content: '确认删除此数据？',
        onOk: () => {
          let node = this.$refs.treeTable.getSelectedNodes()
          this.$api.post('/crm/ActionFormUtil/delete.do', {tableName: this.tableName, id: node[0].id}, r => {
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
      this.$api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: this.tableName}, r => {
        this.data = Util.dataConvertForTree(r.data, this.formObj.treeField)
      })
    },
    setPid: function (row) { // 点击数据设置父ID
      this.pid = row[0].id
      this.CurrentEditData = row[0]
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
