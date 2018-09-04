<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="add">新增</Button>
  </div>
  <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe highlight-row></Table>
  <div class="page-con">
    <Page :total="totalRows" :current="currentPage" :page-size="pageSize" placement="top" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
  </div>
  <Modal v-model="modalFlag" :title="modalTitle" @on-ok="save">
    <div class="modal-field-con">
      <div>
        <Form ref="formPosition" :model="relObj" :label-width="120">
          <FormItem label="流程关键字" class="whole-line-703">
            <Select v-model="relObj.proDefKey">
              <Option v-for="item in keyList" :value="item.name" :key="item.name">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="表名称" class="whole-line-703">
            <Select v-model="relObj.formTableName" @on-change="changeKey">
              <Option v-for="item in tableNameList" :value="item.text" :key="item.text">{{item.text}}</Option>
            </Select>
          </FormItem>
          <FormItem label="表单地址" class="whole-line-703">
            <Input v-model="relObj.formUrl"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
</div>
</template>
<script>
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
          title: '模型编码',
          key: 'id'
        },
        {
          title: '流程关键字',
          key: 'proDefKey'
        },
        {
          title: '表单关联表名',
          key: 'formTableName'
        },
        {
          title: '表单地址',
          key: 'formUrl'
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
                  type: 'success',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.edit(params)
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
                    this.del(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [],
      modalFlag: false,
      modalTitle: '新增流程表单关系',
      relObj: {}, // 关系对象
      keyList: [], // 流程关键字列表
      tableNameList: [] // 表名列表
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
      this.$api.post('/flow/getDeployed', {}, r => {
        this.keyList = r.data
      })
      this.$api.post('/pages/crminterface/getAllTableName.do', {}, r => {
        this.tableNameList = r.data
      })
    },
    changePage: function (current) { // 改变页码
      this.loading = true
      this.currentPage = current
      this.$api.get('/profFormRel/getProfFormRelList?rows=' + this.pageSize + '&page=' + this.currentPage, {}, r => {
        this.totalRows = r.data.total
        this.data = r.data.rows
        this.loading = false
      })
    },
    changePageSize: function (size) { // 改变每页显示数
      this.pageSize = size
      this.changePage(this.currentPage)
    },
    changeKey: function () { // 选择表名称
      if (this.relObj.formTableName !== '') {
        this.relObj.formUrl = '/pages/formDevelopment/newFormOrder.jsp?title=' + this.relObj.formTableName
      }
      this.$api.post('/profFormRel/getModelRelForm', {tabName: this.relObj.formTableName}, r => {
        if (r.data.status === '1') {
          this.$Message.error('该表单已经关联了流程模型，请检查！')
        }
      })
    },
    add: function () { // 新增
      this.relObj = {}
      this.modalFlag = true
      this.modalTitle = '新增流程表单关系'
    },
    edit: function (params) { // 修改
      let temp = params.row
      delete temp._index
      delete temp.rowKey
      this.relObj = temp
      this.modalFlag = true
      this.modalTitle = '修改流程表单关系'
    },
    save: function () { // 保存
      if (this.relObj.id === undefined) {
        this.$api.post('/profFormRel/addProfFormRel', {str: JSON.stringify(this.relObj)}, r => {
          this.$Message.info(r.data.msg)
          this.modalFlag = false
          this.changePage(this.currentPage)
        })
      } else {
        this.$api.post('/profFormRel/updateProfFormRelById', {str: JSON.stringify(this.relObj)}, r => {
          this.$Message.info(r.data.msg)
          this.modalFlag = false
          this.changePage(this.currentPage)
        })
      }
    },
    del: function (params) { // 删除
      this.$Modal.confirm({
        title: '',
        content: '确认删除此数据？',
        onOk: () => {
          this.$api.post('/profFormRel/deleteProfFormRelById', {id: params.row.id}, r => {
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