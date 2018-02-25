<template>
<div>
  <div class="button-con">
    <Button type="primary" @click="uploadFile">上传</Button>
  </div>
  <ul class="fileList">
    <li v-for="(item, index) in files" :key="index">
      <Button @click="deleteFile(item)">删除</Button>
      <a :href="item" :download="pathToName(item)" target="_blank">{{pathToName(item)}}</a>
    </li>
  </ul>
</div>
</template>
<script>
export default {
  props: {
    field: String, // 附件字段
    paths: String // 附件数组
  },
  data () {
    return {}
  },
  methods: {
    init: function () {
      console.log(this.field)
      console.log(this.paths)
    },
    pathToName: function (path) {
      return path.split('/')[3].substring(36)
    },
    uploadFile: function () {}
  },
  mounted () {
    this.init()
  },
  computed: {
    files () {
      console.log(this.paths)
      if (this.paths === undefined) {
        let arr = []
        return arr
      } else {
        this.paths = this.paths.replace(/&quot;/g, '/')
        return this.paths.split(',')
      }
    }
  }
}
</script>
<style>
</style>
