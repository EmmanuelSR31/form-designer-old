<template>
<div class="chart-card">
  <div class="chart-card-inner">
    <div class="chart-title">{{chartObj.title}}</div>
    <div :id="index" style="height: 300px;"></div>
    <div class="config-con config-con-chart">
      <a href="javascript:void(0)" @click="edit" title="修改" style="margin-right: 15px;"><Icon type="md-settings" /></a>
      <a href="javascript:void(0)" @click="del" title="删除"><Icon type="md-close" /></a>
    </div>
  </div>
</div>
</template>
<script>
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
  name: 'workbenchChart',
  props: {
    chartObj: Object,
    index: String
  },
  data () {
    return {
      option: {},
      data: [],
      xData: [],
      yData: [],
      charts: ''
    }
  },
  methods: {
    init: function () {
      this.$api.post('/develop/url/getUrl.do', {name: this.chartObj.url, user_id: '1010'}, r => {
        console.log(r)
        this.data = r.data
        for (let i = 0; i < r.data.length; i++) {
          this.xData.push(r.data[i].name)
          this.yData.push(r.data[i].value)
        }
        this.createChart()
      })
    },
    edit: function () { // 修改
      this.$emit('edit-chart')
    },
    del: function () { // 删除
      this.$emit('del-chart')
    },
    createChart: function () { // 绘制echarts
      this.charts = echarts.init(document.getElementById(this.index))
      if (this.chartObj.chart_style === 'bar' || this.chartObj.chart_style === 'line') {
        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              saveAsImage: {show: true}
            },
            right: 25
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: this.xData
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              type: this.chartObj.chart_style,
              data: this.yData
            }
          ]
        }
      } else if (this.chartObj.chart_style === 'pie') {
        this.option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              saveAsImage: {show: true}
            },
            right: 25
          },
          series: [
            {
              type: 'pie',
              radius: '75%',
              center: ['50%', '50%'],
              data: this.data,
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
      } else if (this.chartObj.chart_style === 'area_chart') {
        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            feature: {
              saveAsImage: {show: true}
            },
            right: 25
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            data: this.xData
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              type: 'line',
              data: this.yData,
              areaStyle: {}
            }
          ]
        }
      }
      this.charts.setOption(this.option)
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    chartObj: { // 数据更新时重绘echarts
      handler: function (newVal, oldVal) {
        this.charts.resize()
        this.charts.clear()
        this.createChart()
      },
      deep: true
    }
  }
}
</script>
<style lang="scss">
.chart-card{
  padding-right: 10px;
  padding-bottom: 10px;
}
.chart-card-inner{
  position: relative;
  background-color: #ffffff;
  border-radius: 5px;
  &:hover{
    .config-con{
      display: block;
    }
  }
}
.chart-title{
  padding-left: 15px;
  line-height: 3;
  font-size: 0.16rem;
}
</style>
