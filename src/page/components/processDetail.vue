<template>
<div class="form-con">
  <Timeline>
    <TimelineItem v-for="(item, index) in list" :key="index">
      <p v-if="item.endDate !== null">{{item.endDate}}</p>
      <p v-else class="color-red">待办</p>
      <p><label>{{item.taskName}}</label></p>
      <p><label>办理人</label>{{item.assignee}}</p>
      <p><label>批注</label>{{item.opinion}}</p>
    </TimelineItem>
  </Timeline>
</div>
</template>
<script>
export default {
  name: 'processDetail',
  props: {
    uuid: String // 数据uuid
  },
  data () {
    return {
      list: [] // 流程明细列表
    }
  },
  methods: {
    /**
    * @desc 取流程明细
    */
    init: function () {
      this.$api.post('/flow/getOpinionsByUuid', {uuid: this.uuid}, r => {
        if (r.data.status === '0') {
          this.list = r.data.list
        } else {
          this.$Message.error('该流程未开启!')
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
