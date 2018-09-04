<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="add">新增</Button>
  </div>
  <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe highlight-row></Table>
  <Modal v-model="modalFlag" :title="modalTitle" @on-ok="save">
    <div class="modal-field-con">
      <div>
        <Form ref="formPosition" :model="positionObj" :label-width="120">
          <FormItem label="职位名称" class="whole-line-703">
            <Input v-model="positionObj.text"></Input>
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
      columns: [
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: '职位名称',
          key: 'text'
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
                on: {
                  click: () => {
                    this.edit(params)
                  }
                }
              }, '修改')
            ])
          }
        }
      ],
      data: [],
      modalFlag: false,
      modalTitle: '新增职位',
      positionObj: {} // 职位对象
    }
  },
  computed: {
    tableHeight: function () { // 表格高度
      return document.body.clientHeight - 160
    }
  },
  methods: {
    init: function () {
      this.getData()
    },
    getData: function () { // 取数据
      this.loading = true
      this.$api.post('/system/user/position/getAll.do', {}, r => {
        this.data = r.data
        this.loading = false
      })
    },
    add: function () { // 新增
      this.positionObj = {}
      this.modalFlag = true
      this.modalTitle = '新增职位'
    },
    edit: function (params) { // 修改
      let temp = params.row
      delete temp._index
      delete temp.rowKey
      this.positionObj = temp
      this.modalFlag = true
      this.modalTitle = '修改职位'
    },
    save: function () { // 保存
      if (this.positionObj.id === undefined) {
        this.positionObj.id = 0
        this.positionObj.activiti_uuid = ''
        this.$api.post('/system/user/position/save.do', {data: JSON.stringify(this.positionObj)}, r => {
          if (r.data.result) {
            this.$Message.success('新建职位成功')
            this.modalFlag = false
            this.getData()
          } else {
            this.$Message.error('新建职位失败')
          }
        })
      } else {
        this.$api.post('/system/user/position/update.do', {data: JSON.stringify(this.positionObj)}, r => {
          if (r.data.result) {
            this.$Message.success('修改职位成功')
            this.modalFlag = false
            this.getData()
          } else {
            this.$Message.error('修改职位失败')
          }
        })
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
