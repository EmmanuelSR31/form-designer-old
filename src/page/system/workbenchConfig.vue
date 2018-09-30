<template>
<div>
  <Row>
    <Col span="3" class="pr10">
      <div class="bg-white padding10">
        <Tree :data="treeData" @on-select-change="initConfig"></Tree>
      </div>
    </Col>
    <Col span="17" class="pr10">
      <Row>
      <draggable class="add-config-con" v-model="configList" :options="dragToOptions">
        <template v-for="(item, index) in configList">
          <template v-if="item.type === 'card'">
            <Col :xs="12" :sm="8" :md="6" :lg="4" :key="index">
              <info-card-config :cardObj="item" @edit-card="editCard(item)" @del-card="delCard(item, index)" :key="index"></info-card-config>
            </Col>
          </template>
          <template v-else-if="item.type === 'chart'">
            <template v-if="item.width === '' || item.width === null || item.width === undefined">
              <Col :lg="12" :key="index">
                <workbench-chart-config :chartObj="item" :index="index" @edit-chart="editChart(item)" @del-chart="delChart(item, index)" :key="index"></workbench-chart-config>
              </Col>
            </template>
            <template v-else>
              <Col :lg="strToInt(item.width)" :key="index">
                <workbench-chart-config :chartObj="item" :index="index" @edit-chart="editChart(item)" @del-chart="delChart(item, index)" :key="index"></workbench-chart-config>
              </Col>
            </template>
          </template>
        </template>
      </draggable>
      </Row>
    </Col>
    <Col span="4">
      <div class="header-title">组件</div>
      <draggable v-model="configTemp" @end="dragEnd" :options="dragOptions">
        <template v-for="(item, index) in configTemp">
          <template v-if="item.type === 'card'">
            <info-card :cardObj="item" :key="index"></info-card>
          </template>
          <template v-else-if="item.type === 'chart'">
            <workbench-chart :chartObj="item" :index="99" :key="index"></workbench-chart>
          </template>
        </template>
      </draggable>
    </Col>
  </Row>
  <Modal v-model="modalCard" title="修改信息卡片" @on-ok="saveCard">
    <div class="modal-field-con">
      <div>
        <Form ref="formCard" :model="cardObj" :label-width="120">
          <FormItem label="图标" class="whole-line-703">
            <Input v-model="cardObj.icon"></Input>
          </FormItem>
          <FormItem label="打开连接" class="whole-line-703">
            <Input v-model="cardObj.url"></Input>
          </FormItem>
          <FormItem label="背景颜色" class="whole-line-703">
            <Input v-model="cardObj.backgroud_colour"></Input>
          </FormItem>
          <FormItem label="内容连接" class="whole-line-703">
            <Input v-model="cardObj.msg"></Input>
          </FormItem>
          <FormItem label="内容描述" class="whole-line-703">
            <Input v-model="cardObj.msg_context"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
  <Modal v-model="modalChart" title="修改图表" @on-ok="saveChart">
    <div class="modal-field-con">
      <div>
        <Form ref="formChart" :model="chartObj" :label-width="120">
          <FormItem label="标题" class="whole-line-703">
            <Input v-model="chartObj.title"></Input>
          </FormItem>
          <FormItem label="宽度" class="whole-line-703">
            <Select v-model="chartObj.width">
              <Option value="24">整行</Option>
              <Option value="12">二分之一</Option>
              <Option value="8">三分之一</Option>
              <Option value="6">四分之一</Option>
            </Select>
          </FormItem>
          <FormItem label="数据来源URL" class="whole-line-703">
            <Input v-model="chartObj.url"></Input>
          </FormItem>
          <FormItem label="图表类型" class="whole-line-703">
            <Select v-model="chartObj.chart_style">
              <Option v-for="item in chartStyle" :value="item.value" :key="item.value">{{item.label}}</Option>
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
import draggable from 'vuedraggable'
import infoCard from '../main-components/info-card.vue'
import infoCardConfig from '../main-components/info-card-config.vue'
import workbenchChart from '../main-components/workbench-chart.vue'
import workbenchChartConfig from '../main-components/workbench-chart-config.vue'
export default {
  components: {
    draggable,
    infoCard,
    infoCardConfig,
    workbenchChart,
    workbenchChartConfig
  },
  data () {
    return {
      loading: false,
      treeData: [ // 职位列表
        {
          title: '职位列表',
          expand: true,
          children: []
        }
      ],
      configObj: {cards: [], charts: []}, // 配置对象
      configList: [], // 配置列表
      configTemp: [ // 默认配置对象
        {type: 'card', icon: 'ios-checkmark', backgroud_colour: '#1890ff', msg: '', msg_context: '信息卡片'},
        {type: 'chart', title: '图表', width: '', chart_style: 'line', url: 'getDepartmentUserNumber'}
      ],
      modalCard: false,
      modalCardTitle: '新增信息卡片',
      cardObj: {}, // 信息卡片对象
      modalChart: false,
      modalChartTitle: '新增图表',
      chartObj: {}, // 图表对象
      currentPid: '', // 选中职位
      chartStyle: [ // 图表类型
        {
          label: 'pie',
          value: 'pie'
        },
        {
          label: 'bar',
          value: 'bar'
        },
        {
          label: 'area_chart',
          value: 'area_chart'
        },
        {
          label: 'line',
          value: 'line'
        },
        {
          label: 'horizontal_bar',
          value: 'horizontal_bar'
        },
        {
          label: 'toLine',
          value: 'toLine'
        }
      ]
    }
  },
  methods: {
    init: function () {
      this.$api.post('/system/user/position/getAll.do', {}, r => {
        if (r.data) {
          let temp = r.data
          for (let i = 0; i < temp.length; i++) {
            temp[i].title = temp[i].text
          }
          this.treeData[0].children = temp
        }
      })
    },
    initConfig: function (row) { // 获取职位的设置
      this.configList = []
      this.currentPid = row[0].id
      this.$api.post('/develop/workbench/findByPostationId.do', {postation_id: this.currentPid}, r => {
        if (r.data.config_str !== '') {
          let obj = JSON.parse(r.data.config_str)
          for (let i = 0; i < obj.infoCard.length; i++) {
            obj.infoCard[i].type = 'card'
          }
          for (let i = 0; i < obj.charts.length; i++) {
            obj.charts[i].type = 'chart'
          }
          this.configList = [...obj.infoCard, ...obj.charts]
        }
      })
    },
    editCard: function (item) { // 修改信息卡片
      this.cardObj = item
      this.modalCard = true
    },
    saveCard: function () { // 保存信息卡片
      this.cardObj = {}
      this.modalCard = false
    },
    delCard: function (item, index) { // 删除信息卡片
      this.configList.splice(index, 1)
    },
    dragEnd: function (evt) { // 拖拽结束复制
      if (evt.item.className === 'info-card') {
        this.configList.push(JSON.parse(JSON.stringify(this.configTemp[0])))
      } else {
        this.configList.push(JSON.parse(JSON.stringify(this.configTemp[1])))
      }
      return false
    },
    editChart: function (item) { // 修改图表
      this.chartObj = item
      this.modalChart = true
    },
    saveChart: function () { // 保存图表
      this.chartObj = {}
      this.modalChart = false
    },
    delChart: function (item, index) { // 删除图表
      this.configList.splice(index, 1)
    },
    save: function () { // 保存
      let config = {}
      for (let i = 0; i < this.configList.length; i++) {
        if (this.configList[i].type === 'card') {
          this.configObj.cards.push(this.configList[i])
        } else if (this.configList[i].type === 'chart') {
          this.configObj.charts.push(this.configList[i])
        }
      }
      config.config_str = JSON.stringify(this.configObj)
      config.postation_id = this.currentPid
      this.$api.post('/develop/workbench/save.do', {data: JSON.stringify(config)}, r => {
        if (r.data.result) {
          this.$Message.success('保存成功')
        } else {
          this.$Message.error(r.data.describe)
        }
      })
    },
    strToInt: function (str) { // 字符串转为整数
      return Util.strToInt(str)
    }
  },
  computed: {
    dragOptions () {
      return {
        group: {
          name: 'configTo'
        },
        sort: false
      }
    },
    dragToOptions () {
      return {
        group: {
          // put: ['configTo']
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
.add-config-con{
  min-height: 800px;
  background-color: #ffffff;
}
</style>

