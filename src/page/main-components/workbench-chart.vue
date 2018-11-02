<template>
<div class="chart-card">
  <div class="chart-title">{{chartObj.title}}</div>
  <div :id="index" style="height: 300px;"></div>
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
    chartObj: Object, // 图表对象
    index: String // 图表顺序
  },
  data () {
    return {
      option: {}, // 图表配置对象
      data: [], // 图表数据
      xData: [], // 图表X轴数据
      yData: [], // 图表Y轴数据
      charts: ''  // echarts对象
    }
  },
  methods: {
    /**
    * @desc 初始化
    */
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
    /**
    * @desc 绘制echarts
    */
    createChart: function () {
      this.charts = echarts.init(document.getElementById(this.index))
      if (this.chartObj.chart_style === 'bar' || this.chartObj.chart_style === 'line') {
        this.charts.setOption({
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
        })
      } else if (this.chartObj.chart_style === 'pie') {
        this.charts.setOption({
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
        })
      } else if (this.chartObj.chart_style === 'area_chart') {
        this.charts.setOption({
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
        })
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="scss">
.chart-card{
  margin-right: 10px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border-radius: 5px;
}
.chart-title{
  padding-left: 15px;
  line-height: 3;
  font-size: 0.16rem;
}
</style>
