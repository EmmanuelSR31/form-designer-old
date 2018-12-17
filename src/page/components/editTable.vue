<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="addTableData">新增</Button>
  </div>
  <Table border stripe :columns="columns" :data="data"></Table>
</div>
</template>

<script>
import api from '@/api/index.js'
import iView from 'iview'
import Util from '@/utils/index'
export default {
  name: 'editTable',
  props: {
    tableName: String, // 表格名
    recordID: String, // 主表数据UUID
    viewFlag: Boolean // 是否查看
  },
  data () {
    return {
      formObj: {}, // 表单对象
      loading: false, // 加载中
      totalRows: 0, // 数据总数
      data: [], // 数据
      columns: [], // 表格表头
      currentData: {}, // 选中数据
      selectData: this.$store.state.selectData // 下拉数据
    }
  },
  methods: {
    /**
    * @desc 取数据
    */
    getData: function () {
      this.loading = true
      this.$api.post('/crm/ActionFormUtil/getDataByUuid.do', {tableName: this.tableName, uuid: this.recordID}, r => {
        this.totalRows = r.data.total
        this.data = r.data.rows
        this.loading = false
      })
    },
    /**
    * @desc 初始化
    */
    init: function () {
      this.data = []
      this.columns = []
      this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.tableName}, r => {
        this.formObj = r.data
        Util.initFormQuoteSelectData(this.formObj.field)
        this.initEditTableColumns()
        this.columnsAddAction()
        this.getData()
      })
    },
    /**
    * @desc 生成表格表头
    */
    initEditTableColumns: function () {
      this.columns.push({
        type: 'index',
        title: '序列',
        width: 50,
        align: 'center'
      })
      for (let variable of this.formObj.field) {
        if (variable.listDisplay === 'true' || variable.listDisplay === true) {
          if (variable.fieldType === 'combobox') {
            this.columns.push({
              title: variable.title,
              key: variable.text,
              render: (h, params) => {
                return h('Select', {
                  props: {
                    value: parseInt(params.row[variable.text])
                  },
                  on: {
                    input: (e) => {
                      params.row[variable.text] = e + ''
                    }
                  }
                }, this.selectData[variable.selectID].map((item) => (
                  h('Option', {props: {value: item.id}}, item.text)
                )))
              }
            })
          } else if (variable.fieldType === 'numberbox') {
            this.columns.push({
              title: variable.title,
              key: variable.text,
              render: (h, params) => {
                return h('InputNumber', {
                  props: {
                    value: params.row[variable.text]
                  },
                  on: {
                    input: (e) => {
                      params.row[variable.text] = e
                    }
                  }
                })
              }
            })
          } else if (['datebox', 'datetimebox', 'monthbox', 'yearbox'].indexOf(variable.fieldType) !== -1) {
            this.columns.push({
              title: variable.title,
              key: variable.text,
              render: (h, params) => {
                return h('DatePicker', {
                  props: {
                    value: params.row[variable.text],
                    type: variable.fieldType.substring(0, variable.fieldType.length - 3)
                  },
                  on: {
                    input: (e) => {
                      params.row[variable.text] = e
                    }
                  }
                })
              }
            })
          } else {
            this.columns.push({
              title: variable.title,
              key: variable.text,
              render: (h, params) => {
                return h('Input', {
                  props: {
                    value: params.row[variable.text]
                  },
                  on: {
                    input: (e) => {
                      params.row[variable.text] = e
                    }
                  }
                })
              }
            })
          }
        }
      }
    },
    /**
    * @desc 表头加操作列
    */
    columnsAddAction: function () {
      this.columns.push({
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
                  this.saveTableData(params)
                }
              }
            }, '保存'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.deleteTableData(params)
                }
              }
            }, '删除')
          ])
        }
      })
    },
    /**
    * @desc 新增数据
    */
    addTableData: function () {
      this.data.push({})
    },
    /**
    * @desc 保存数据
    * @param {Object} params 要保存的数据
    */
    saveTableData: function (params) {
      let obj = {}
      let temp = JSON.parse(JSON.stringify(params.row))
      delete temp._index
      delete temp._rowKey
      obj.title = this.tableName
      obj.field = Util.getFormValues(temp)
      if (temp.id === undefined) {
        obj.field.push({text: 'uuid', value: '\'' + this.recordID + '\''})
        let jsonStr = JSON.stringify(obj)
        console.log(jsonStr)
        this.$api.post('/crm/ActionFormUtil/insert.do', {jsonStr: jsonStr}, r => {
          if (r.data === 1) {
            this.$Message.success('新增数据成功')
            this.$emit('edit-success')
            this.getData()
          } else {
            this.$Message.error('新增数据失败')
          }
        })
      } else {
        let jsonStr = JSON.stringify(obj)
        console.log(jsonStr)
        this.$api.post('/crm/ActionFormUtil/update.do', {jsonStr: jsonStr, id: params.row.id}, r => {
          if (r.data === 1) {
            this.$Message.success('修改数据成功')
            this.$emit('edit-success')
            this.getData()
          } else {
            this.$Message.error('修改数据失败')
          }
        })
      }
    },
    /**
    * @desc 删除数据
    * @param {Object} params 要删除的数据
    */
    deleteTableData: function (params) {
      iView.Modal.confirm({
        title: '',
        content: '确认删除此数据？',
        onOk: () => {
          if (params.row.id !== undefined) {
            api.post('/crm/ActionFormUtil/delete.do', {tableName: this.tableName, id: params.row.id}, r => {
              if (r.data === '0') {
                iView.Message.error('删除数据失败')
              } else {
                iView.Message.success('删除数据成功')
                this.$emit('edit-success')
                this.getData()
              }
            })
          } else {
            this.data.splice(params.index, 1)
          }
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

<style>

</style>
