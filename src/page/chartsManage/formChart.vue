<template>
<div class="form-con">
  <Form :label-width="120">
    <FormItem label="请选择：" class="whole-line-703">
      <Select v-model="currentChart" @on-change="initChartCondition" style="width:400px">
        <Option v-for="item in formCharts" :value="item.id" :key="item.id">{{item.name}}</Option>
      </Select>
    </FormItem>
  </Form>
  <Form :model="searchData" inline>
    <template v-for="item in searchConditions">
      <template v-for="fieldItem in fields">
        <template v-if="item.field === fieldItem.text">
          <FormItem :label="fieldItem.title" :key="item.field">
            <template v-if="fieldItem.fieldType === 'textbox'">
              <Input v-model="searchData[fieldItem.text]" :key="fieldItem.text"></Input>
            </template>
            <template v-else-if="fieldItem.fieldType === 'combobox'">
              <Select v-model="searchData[fieldItem.text]" :key="fieldItem.text">
                <Option v-for="tmp in selectData[item.selectID]" :value="tmp.id" :key="tmp.id">{{tmp.text}}</Option>
              </Select>
            </template>
            <template v-else-if="fieldItem.fieldType === 'datebox'">
              <DatePicker type="date" :value="searchData[fieldItem.text]" @on-change="searchData[fieldItem.text]=$event" :key="fieldItem.text"></DatePicker>
            </template>
          </FormItem>
        </template>
      </template>
    </template>
    <template v-if="currentChart.id !== undefined">
      <Select v-model="pageSize" style="width:90px">
        <Option value="20">最近20条</Option>
        <Option value="30">最近30条</Option>
        <Option value="40">最近40条</Option>
        <Option value="50">最近50条</Option>
        <Option value="80">最近80条</Option>
        <Option value="100">最近100条</Option>
      </Select>
      <Button type="primary" @click="initChart">生成图表</Button>
    </template>
  </Form>
  <div v-show="showChart">
    <chart :options="option"></chart>
  </div>
</div>
</template>
<script>
import Util from '@/utils/index'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
export default {
  data () {
    return {
      tableName: this.$route.params.tableName, // 表单名
      fields: [], // 表单字段
      formCharts: [], // 表单图表
      currentChart: {}, // 选中图表
      searchConditions: [], // 搜索条件数组
      searchData: {}, // 搜索数据对象
      selectData: this.$store.state.selectData, // 下拉数据
      pageSize: '20', // 查询条数
      option: {},
      showChart: false // 显示图表
    }
  },
  methods: {
    init: function () {
      this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.tableName}, r => {
        this.fields = r.data.field
      })
      this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsByFormName.do', {formName: this.tableName}, r => {
        this.formCharts = r.data.rows
      })
    },
    initChartCondition: function (value) { // 显示搜索条件
      for (let iterator of this.formCharts) {
        if (iterator.id === value) {
          this.currentChart = iterator
          this.searchData = {}
          this.searchConditions = JSON.parse(this.currentChart.searchs)
          break
        }
      }
    },
    initChart: function () { // 取图表数据
      let temp = ''
      for (let iterator of this.searchConditions) {
        if (!Util.isEmpty(this.searchData[iterator.field])) {
          temp += ' ' + iterator.manner + ' ' + iterator.field + ' ' + iterator.condition + ' '
          if (iterator.condition === 'like' || iterator.condition === 'not like') {
            temp += ' \'%' + this.searchData[iterator.field] + '%\' '
          } else {
            temp += ' \'' + this.searchData[iterator.field] + '\' '
          }
        }
      }
      temp += ' limit 0,' + this.pageSize
      this.currentChart.xData = []
      this.currentChart.yData = []
      console.log(temp)
      this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsDataBySearch.do', {formName: this.tableName, field: this.currentChart.x_field, condition: temp, create_user_id: '1010'}, r => {
        if (r.data.length > 0) {
          this.currentChart.xData = r.data.split(',')
        }
        this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsDataBySearch.do', {formName: this.tableName, field: this.currentChart.y_field, condition: temp, create_user_id: '1010'}, r => {
          if (r.data.length > 0) {
            this.currentChart.yData = r.data.split(',')
          }
          this.createChart()
        })
      })
    },
    createChart: function () { // 生成图表
      if (this.currentChart.type === 'line' || this.currentChart.type === 'bar') {
        this.option = {
          title: {
            text: this.currentChart.name,
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
            name: this.currentChart.name_x,
            nameLocation: 'center',
            nameGap: 20,
            data: this.currentChart.xData
          },
          yAxis: {
            type: 'value',
            name: this.currentChart.name_y
          },
          series: [
            {
              name: this.currentChart.name_y,
              type: this.currentChart.type,
              data: this.currentChart.yData
            }
          ]
        }
      } else if (this.currentChart.type === 'pie') {
        let pieData = []
        this.currentChart.xData.forEach((element, index) => {
          pieData.push({
            name: element,
            value: this.currentChart.yData[index]
          })
        })
        this.option = {
          title: {
            text: this.currentChart.name,
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              restore: {show: true},
              saveAsImage: {show: true}
            },
            right: 25
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: this.currentChart.xData
          },
          series: [
            {
              name: this.currentChart.name_y,
              type: 'pie',
              radius: '75%',
              center: ['50%', '60%'],
              data: pieData,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      }
      this.showChart = true
    }
  },
  mounted () {
    this.init()
  }
}
</script>
