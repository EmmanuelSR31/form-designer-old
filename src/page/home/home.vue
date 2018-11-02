<template>
<div class="home-con">
  <Row>
    <Col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item, index) in infoCards" :key="index">
      <info-card :cardObj="item"></info-card>
    </Col>
  </Row>
  <Row>
    <Col :md="12" :lg="8" v-for="(item, index) in charts" :key="index">
      <workbench-chart :chartObj="item" :index="index"></workbench-chart>
    </Col>
  </Row>
</div>
</template>
<script>
import infoCard from '../main-components/info-card.vue'
import workbenchChart from '../main-components/workbench-chart.vue'
export default {
  components: {
    infoCard, // 信息卡片组件
    workbenchChart // 图表组件
  },
  data () {
    return {
      infoCards: [], // 信息卡片数据
      charts: [] // 图表数据
    }
  },
  methods: {
    /**
    * @desc 初始化
    */
    init: function () {
      this.$api.post('/develop/workbench/findByPostationId.do', {postation_id: '9'}, r => {
        if (r.data) {
          let obj = JSON.parse(r.data.config_str)
          this.infoCards = obj.infoCard
          this.charts = obj.charts
          console.log(obj)
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="scss">
.home-con{
  padding-left: 10px;
}
</style>
