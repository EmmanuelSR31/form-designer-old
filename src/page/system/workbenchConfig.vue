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
              <info-card-config :cardObj="item" @edit-card="editCard(item)" @del-card="delCard(index)" :key="index"></info-card-config>
            </Col>
          </template>
          <template v-else-if="item.type === 'chart'">
            <template v-if="item.width === '' || item.width === null || item.width === undefined">
              <Col :lg="12" :key="index">
                <workbench-chart-config :chartObj="item" :index="index" @edit-chart="editChart(item)" @del-chart="delChart(index)" :key="index"></workbench-chart-config>
              </Col>
            </template>
            <template v-else>
              <Col :lg="strToInt(item.width)" :key="index">
                <workbench-chart-config :chartObj="item" :index="index" @edit-chart="editChart(item)" @del-chart="delChart(index)" :key="index"></workbench-chart-config>
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
    draggable, // 拖拽插件
    infoCard, // 信息卡片组件
    infoCardConfig, // 带设置的信息卡片组件
    workbenchChart, // 图表组件
    workbenchChartConfig // 带设置的图表组件
  },
  data () {
    return {
      loading: false, // 载入中
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
      modalCard: false, // 信息卡片对话框是否显示
      modalCardTitle: '新增信息卡片', // 信息卡片对话框标题
      cardObj: {}, // 信息卡片对象
      modalChart: false, // 图表对话框是否显示
      modalChartTitle: '新增图表', // 图表对话框标题
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
    /**
    * @desc 取职位数据
    */
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
    /**
    * @desc 获取选中职位的设置
    * @param {Object} row 选中的职位对象
    */
    initConfig: function (row) {
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
    /**
    * @desc 修改信息卡片
    * @param {Object} item 要修改的信息卡片对象
    */
    editCard: function (item) {
      this.cardObj = item
      this.modalCard = true
    },
    /**
    * @desc 保存信息卡片
    */
    saveCard: function () {
      this.cardObj = {}
      this.modalCard = false
    },
    /**
    * @desc 删除信息卡片
    * @param {Num} index 要删除的信息卡片位置
    */
    delCard: function (index) {
      this.configList.splice(index, 1)
    },
    /**
    * @desc 拖拽结束复制
    * @param {Object} evt 事件对象
    */
    dragEnd: function (evt) {
      evt.item.className === 'info-card' ? this.configList.push(JSON.parse(JSON.stringify(this.configTemp[0]))) : this.configList.push(JSON.parse(JSON.stringify(this.configTemp[1])))
      return false
    },
    /**
    * @desc 修改图表
    * @param {Object} item 要修改的图表对象
    */
    editChart: function (item) {
      this.chartObj = item
      this.modalChart = true
    },
    /**
    * @desc 保存图表
    */
    saveChart: function () { // 保存图表
      this.chartObj = {}
      this.modalChart = false
    },
    /**
    * @desc 删除图表
    * @param {Num} index 要删除的图表位置
    */
    delChart: function (index) {
      this.configList.splice(index, 1)
    },
    /**
    * @desc 保存
    */
    save: function () {
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
        r.data.result ? this.$Message.success('保存成功') : this.$Message.error(r.data.describe)
      })
    },
    /**
    * @desc 字符串转为整数
    * @param {String} str 字符串
    * @return {Num} 返回的整数
    */
    strToInt: function (str) {
      return Util.strToInt(str)
    }
  },
  computed: {
    dragOptions () { // 拖拽源配置
      return {
        group: {
          name: 'configTo'
        },
        sort: false
      }
    },
    dragToOptions () { // 拖拽目标配置
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

