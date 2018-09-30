<template>
<div class="info-card">
  <div class="info-card-inner">
    <div class="info-card-icon" :style="{backgroundColor: cardObj.backgroud_colour}">
      <Icon type="ios-checkmark" />
    </div>
    <div class="info-card-text"><div>2</div>{{cardObj.msg_context}}</div>
    <div class="clear"></div>
  </div>
</div>
</template>
<script>
export default {
  name: 'infoCard',
  props: {
    cardObj: Object
  },
  methods: {
    init: function () {
      this.$api.post('/develop/url/getUrl.do', {postation_id: '9', msg: this.cardObj.msg, user_id: '1010'}, r => {
        console.log(r)
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="scss">
.info-card{
  padding-right: 10px;
  padding-bottom: 10px;
}
.info-card-inner{
  position: relative;
  background-color: #ffffff;
  border-radius: 5px;
}
.info-card-icon{
  float: left;
  width: 1rem;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  i{
    font-size: 1rem;
    color: #ffffff;
    transition: transform 0.8s;
    &:hover{
      transform: rotate(360deg);
    }
  }
}
.info-card-text{
  padding-left: 1rem;
  padding-top: 0.1rem;
  text-align: center;
  font-size: 0.16rem;
  div{
    font-size: 0.31rem;
  }
}
</style>
