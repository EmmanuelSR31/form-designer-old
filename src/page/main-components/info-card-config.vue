<template>
<div class="info-card">
  <div class="info-card-inner">
    <div class="info-card-icon" :style="{backgroundColor: cardObj.backgroud_colour}">
      <Icon :type="cardObj.icon" />
    </div>
    <div class="info-card-text"><div>2</div>{{cardObj.msg_context}}</div>
    <div class="clear"></div>
    <div class="config-con">
      <a href="javascript:void(0)" @click="edit" title="修改" style="margin-right: 15px;"><Icon type="md-settings" /></a>
      <a href="javascript:void(0)" @click="del" title="删除"><Icon type="md-close" /></a>
    </div>
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
    },
    edit: function () {
      this.$emit('edit-card')
    },
    del: function () {
      this.$emit('del-card')
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
  &:hover{
    .config-con{
      display: block;
    }
  }
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
