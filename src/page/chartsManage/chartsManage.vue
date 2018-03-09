<template>
<div>
  <Row>
    <Col span="8">
      <div class="bg-white padding10">
        <Tree :data="treeData" @on-select-change="initCharts"></Tree>
      </div>
    </Col>
    <Col span="15" offset="1">
      <div class="table-search-con">
        <Button type="primary" @click="addChart">新增</Button>
      </div>
      <Table border :loading="loading" :columns="columns" :data="data" stripe></Table>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
import addChart from './addChart.vue'
import editChart from './editChart.vue'
export default {
  data () {
    return {
      loading: false,
      treeData: [], // 栏目数据
      columns: [
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: '表单',
          key: 'form_name'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'descr'
        },
        {
          title: '图表类型',
          key: 'type'
        },
        {
          title: 'X轴字段',
          key: 'x_field'
        },
        {
          title: 'Y轴字段',
          key: 'y_field'
        },
        {
          title: '创建人',
          key: 'creater'
        },
        {
          title: '创建时间',
          key: 'create_date'
        },
        {
          title: '操作',
          key: 'action',
          width: 126,
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
                    this.editChart(params)
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
                    this.deleteChart(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [], // 图表数据
      chartObj: {}, // 图表对象
      currentForm: '' // 选中栏目
    }
  },
  methods: {
    init: function () { // 取左侧栏目列表
      this.$api.post('/topJUI/index/getMenuList.do', {}, r => {
        if (r.data) {
          this.treeData = Util.formatterTreeData(r.data)
        }
      })
    },
    initCharts: function (row) { // 选择栏目
      this.currentForm = row[0].url.split('=')[1]
      this.data = []
      this.initChartsData()
    },
    initChartsData: function () { // 取图表数据
      this.loading = true
      this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsByFormName.do', {formName: this.currentForm}, r => {
        this.data = r.data.rows
        this.loading = false
      })
    },
    addChart: function () { // 新增图表
      if (this.currentForm === '') {
        this.$Message.warning('请先选择一条目录')
      } else {
        this.$layer.iframe({
          type: 2,
          content: {
            content: addChart, // 传递的组件对象
            parent: this, // 当前的vue对象
            data: {
              tableName: this.currentForm
            }
          },
          shadeClose: false,
          shade: false,
          maxmin: true,
          area: ['800px', document.body.clientHeight - 20 + 'px'],
          title: '新增图表'
        })
      }
    },
    editChart: function (row) { // 修改图表
      let temp = row.row
      delete temp._index
      delete temp.orwKey
      this.$layer.open({
        type: 2,
        content: {
          content: editChart, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            chartObj: temp
          }
        },
        shadeClose: false,
        shade: false,
        maxmin: true,
        area: ['800px', document.body.clientHeight - 20 + 'px'],
        title: '修改图表'
      })
    },
    deleteChart: function (row) { // 删除图表
      this.$Modal.confirm({
        title: '',
        content: '确认删除此图表？',
        onOk: () => {
          this.$api.post('/crm/ActionFormSelectUtil/Select/deleteCharts.do', {id: row.row.id}, r => {
            if (r.data === '0') {
              this.$Message.error('删除图表失败')
            } else {
              this.$Message.success('删除图表成功')
              this.initChartsData()
            }
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
