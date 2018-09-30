<template>
<div>
  <Row>
    <Col span="4">
      <div class="edit-chart-left-con">
        <div class="edit-chart-left-title">表单</div>
        <Select v-model="currentForm" @on-change="changeForm">
          <Option v-for="(item, index) in formList" :value="item" :key="index">{{ item.name }}</Option>
        </Select>
        <div class="edit-chart-left-line"></div>
        <div class="edit-chart-left-title">字段</div>
        <ul class="edit-chart-left-list">
        <draggable v-model="fields" :options="dragOption" @end="dragEnd">
          <li v-for="(item, index) in fields" :key="index">{{item.title}}</li>
        </draggable>
        </ul>
      </div>
    </Col>
    <Col span="16" class="edit-chart-middle">
      <div class="edit-chart-field-con">
        <label>维度：</label>
        <div class="edit-chart-field-inner">
          <ul>
            <draggable v-model="x_field" :options="dragToXOption">
              <li v-for="(item, index) in x_field" :key="index">
                <Dropdown trigger="click" placement="bottom-start">
                  <Button type="primary">
                    <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
                    <template v-else>{{item.title}}</template>
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <DropdownItem><a href="javascript:void(0)" @click="setFieldName(item)">设置字段</a></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </draggable>
          </ul>
        </div>
      </div>
      <div class="edit-chart-field-con">
        <label>数值：</label>
        <div class="edit-chart-field-inner">
          <ul>
            <draggable v-model="y_field" :options="dragToYOption" class="drag-y-con">
              <li v-for="(item, index) in y_field" :key="index">
                <Dropdown trigger="click" placement="bottom-start">
                  <Button type="primary">
                    <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
                    <template v-else>{{item.title}}</template>
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <DropdownItem><a href="javascript:void(0)" :class="{'selected': item.calculateType === 'sum'}" @click="setFieldCalculateType(item, 'sum')">求和</a></DropdownItem>
                    <DropdownItem><a href="javascript:void(0)" :class="{'selected': item.calculateType === 'count'}" @click="setFieldCalculateType(item, 'count')">计数</a></DropdownItem>
                    <DropdownItem divided><a href="javascript:void(0)" @click="setFieldName(item)">设置字段</a></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </draggable>
          </ul>
        </div>
      </div>
      <div id="main" style="height:400px;"></div>
    </Col>
    <Col span="4">

    </Col>
  </Row>
  <Modal v-model="modalFieldName" title="设置字段" @on-ok="saveFieldName">
    <div class="modal-field-con">
      <div>
        <Form ref="formFieldName" :model="currentField" :label-width="120">
          <FormItem label="字段别名" class="whole-line-703">
            <Input v-model="currentField.alias"></Input>
          </FormItem>
          <FormItem label="字段描述" class="whole-line-703">
            <Input v-model="currentField.describe"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
</div>
</template>
<script>
import Util from '@/utils/index'
import draggable from 'vuedraggable'
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
require('es6-promise').polyfill()
export default {
  components: {
    draggable
  },
  data () {
    return {
      loading: false,
      formList: [], // 表单数据
      fields: [], // 表单字段
      chartObj: {type: 'line'}, // 图表对象
      currentForm: {}, // 选中表单
      currentField: {},  // 选中字段
      modalFieldName: false,
      x_field: [], // 维度字段
      y_field: [], // 数值字段
      xData: [], // 维度数据
      yData: [], // 数值数据
      option: {},
      charts: '',
      searchConditions: [] // 筛选条件
    }
  },
  methods: {
    init: function () { // 取表单列表
      this.$api.post('/crm/ActionFormUtil/getAllTable.do', {}, r => {
        if (r.data) {
          this.formList = r.data.rows
        }
      })
    },
    changeForm: function () { // 选择表单
      this.fields = JSON.parse(this.currentForm.str_json).field
    },
    dragEnd: function (event) { // 拖拽结束
      if (event.to.className === 'drag-y-con') {
        this.setFieldCalculateType(this.y_field[this.y_field.length - 1], 'sum')
      }
      console.log(this.y_field)
      this.dataChange()
    },
    setFieldName: function (item) { // 设置字段名称
      this.currentField = item
      this.modalFieldName = true
    },
    saveFieldName: function () { // 保存字段名称
      this.modalFieldName = false
    },
    setFieldCalculateType: function (item, calculateType) { // 设置字段计算方式
      this.$set(item, 'calculateType', calculateType)
    },
    dataChange: function () { // 是否刷新图表
      if (this.x_field.length > 0 && this.y_field.length > 0 && !Util.isEmpty(this.currentForm.title)) {
        this.initChart()
      }
    },
    initChart: function () { // 取图表数据
      let temp = ''
      this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsDataBySearch.do', {formName: this.currentForm.title, field: this.x_field, condition: temp, create_user_id: '1010'}, r => {
        if (r.data.length > 0) {
          this.xData = r.data.split(',')
        }
        this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsDataBySearch.do', {formName: this.currentForm.title, field: this.y_field, condition: temp, create_user_id: '1010'}, r => {
          if (r.data.length > 0) {
            this.yData = r.data.split(',')
          }
          this.createChart()
        })
      })
    },
    createChart: function () { // 生成图表
      this.charts = echarts.init(document.getElementById('main'))
      console.log(this.xData)
      console.log(this.yData)
      if (this.chartObj.type === 'line' || this.chartObj.type === 'bar') {
        this.option = {
          title: {
            text: this.chartObj.name,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              restore: {show: true},
              saveAsImage: {show: true}
            },
            right: 25
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            name: this.chartObj.name_x,
            nameLocation: 'center',
            nameGap: 20,
            data: this.xData
          },
          yAxis: {
            type: 'value',
            name: this.chartObj.name_y
          },
          series: [
            {
              name: this.chartObj.name_y,
              type: this.chartObj.type,
              data: this.yData
            }
          ]
        }
      }
      this.charts.setOption(this.option)
    }
  },
  computed: {
    dragOption () {
      return {
        group: {
          name: 'fields',
          pull: 'clone'
        },
        sort: false
      }
    },
    dragToXOption () {
      return {
        group: {
          put: ['fields']
        }
      }
    },
    dragToYOption () {
      return {
        group: {
          put: ['fields']
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="scss">
.edit-chart-left-con{
  padding: 10px;
  border-right: 1px solid #999;
}
.edit-chart-left-title{
  font-size: 0.13rem;
  font-weight: 600;
  line-height: 30px;
}
.edit-chart-left-line{
  height: 1px;
  background-color: #ddd;
  margin: 10px -10px;
}
.edit-chart-left-list{
  border-top: 1px solid #ddd;
  padding-left: 10px;
  li{
    line-height: 30px;
    cursor: move;
  }
}
.edit-chart-middle{
  padding: 10px;
}
.edit-chart-field-con{
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
  label{
    float: left;
    width: 60px;
    line-height: 34px;
  }
}
.edit-chart-field-inner{
  margin-left: 60px;
  ul{
    &>div{
      min-height: 34px;
    }
    &>div>li{
      float: left;
      height: 34px;
      line-height: 34px;
    }
  }
  .ivu-dropdown{
    margin-right: 10px;
  }
  a{
    color: #333;
    &.selected{
      color: #2d8cf0;
    }
  }
}
</style>
