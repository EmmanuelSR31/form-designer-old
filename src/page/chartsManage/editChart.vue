<template>
<div class="form-con">
  <Form :model="chartObj" :label-width="120">
    <FormItem label="名称">
      <Input v-model="chartObj.name"></Input>
    </FormItem>
    <FormItem label="返回类型">
      <Select v-model="chartObj.type">
        <Option value="line">折线图</Option>
        <Option value="bar">柱状图</Option>
        <Option value="pie">饼图</Option>
      </Select>
    </FormItem>
    <FormItem label="描述">
      <Input v-model="chartObj.descr"></Input>
    </FormItem>
    <FormItem label="X轴字段">
      <Select v-model="chartObj.x_field">
        <Option v-for="item in fields" :value="item.text" :key="item.text">{{item.title}}</Option>
      </Select>
    </FormItem>
    <FormItem label="Y轴字段(数值)">
      <Select v-model="chartObj.y_field">
        <Option v-for="item in fields" :value="item.text" :key="item.text">{{item.title}}</Option>
      </Select>
    </FormItem>
    <FormItem label="搜索条件">
      <div class="table-search-con">
        <Button type="primary" @click="addSearchs">新增</Button>
      </div>
      <Table border :loading="loading" :columns="columns" :data="searchsData" stripe></Table>
    </FormItem>
  </Form>
  <div class="text-center">
    <Button class="mr100" @click="cancel">取消</Button>
    <Button type="primary" @click="save">保存</Button>
  </div>
  <Modal v-model="modalSearchs" :title="modalSearchsTitle" @on-ok="saveSearchs">
    <div class="modal-field-con">
      <div>
        <Form :model="searchsObj" :label-width="120">
          <FormItem label="方式" class="whole-line-703">
            <Select v-model="searchsObj.manner">
              <Option v-for="item in manner" :value="item.value" :key="item.value">{{item.text}}</Option>
            </Select>
          </FormItem>
          <FormItem label="字段" class="whole-line-703">
            <Select v-model="searchsObj.field">
              <Option v-for="item in fields" :value="item.text" :key="item.text">{{item.title}}</Option>
            </Select>
          </FormItem>
          <FormItem label="条件" class="whole-line-703">
            <Select v-model="searchsObj.condition">
              <Option v-for="item in condition" :value="item.value" :key="item.value">{{item.text}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
</div>
</template>
<script>
import Util from '@/utils/index'
export default {
  props: {
    chartObj: {} // 图表对象
  },
  data () {
    return {
      manner: this.$store.state.searchManner, // 搜索条件
      condition: this.$store.state.searchCondition, // 搜索条件
      loading: false,
      fields: [], // 表单字段
      searchsData: [], // 搜索条件数据
      modalSearchs: false,
      modalSearchsTitle: '新增搜索条件',
      searchsMethod: '',
      columns: [
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: '方式',
          key: 'manner',
          align: 'center'
        },
        {
          title: '字段',
          key: 'field',
          align: 'center'
        },
        {
          title: '条件',
          key: 'condition',
          align: 'center'
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
                    this.editSearchs(params)
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
                    this.deleteSearchs(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      searchsObj: {} // 搜索条件对象
    }
  },
  methods: {
    init: function () {
      this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.chartObj.form_name}, r => {
        this.fields = Util.removeFieldTable(r.data.field)
      })
      this.searchsData = JSON.parse(this.chartObj.searchs)
    },
    cancel: function () {
      this.$parent.$layer.closeAll()
    },
    save: function () { // 保存
      this.chartObj.searchs = JSON.stringify(this.searchsData)
      for (let iterator of this.fields) {
        if (this.chartObj.x_field === iterator.text) {
          this.chartObj.name_x = iterator.title
        }
        if (this.chartObj.y_field === iterator.text) {
          this.chartObj.name_y = iterator.title
        }
      }
      let jsonStr = JSON.stringify(this.chartObj)
      this.$api.post('/crm/ActionFormSelectUtil/Select/updateCharts.do', {jsonStr: jsonStr, id: this.chartObj.id}, r => {
        if (r.data === 1) {
          this.$Message.success('修改图表成功')
          this.$parent.initChartsData()
          this.$parent.$layer.closeAll()
        } else {
          this.$Message.error('修改图表失败')
        }
      })
    },
    addSearchs: function () { // 新增搜索条件
      this.searchsObj = {}
      this.modalSearchsTitle = '新增搜索条件'
      this.searchsMethod = 'add'
      this.modalSearchs = true
    },
    editSearchs: function (row) { // 修改搜索条件
      this.searchsObj = row.row
      delete this.searchsObj._index
      delete this.searchsObj.rowKey
      this.modalSearchsTitle = '修改搜索条件'
      this.searchsMethod = 'edit'
      this.modalSearchs = true
    },
    saveSearchs: function () { // 保存搜索条件
      if (this.searchsMethod === 'add') {
        this.searchsData.push(this.searchsObj)
      } else if (this.searchsMethod === 'edit') {
        let index = this.searchsData.indexOf(this.searchsObj)
        this.searchsData[index] = this.searchsObj
      }
    },
    deleteSearchs: function (row) { // 删除搜索条件
      let obj = row.row
      delete this.searchsObj._index
      delete this.searchsObj.rowKey
      this.searchsData.splice(this.searchsData.indexOf(obj), 1)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
