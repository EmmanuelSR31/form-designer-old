<template>
<div>
  <div class="button-con">
    <Upload multiple action="/apis/upload/file" :show-upload-list="false" :on-success="uploadSuccess">
      <Button type="primary" icon="ios-cloud-upload-outline">上传</Button>
    </Upload>
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
    paths: String, // 附件数组字符串
    files: [] // 附件数组
  },
  data () {
    return {}
  },
  methods: {
    init: function () {
      console.log(this.field)
      console.log(this.paths)
      if (this.paths !== undefined && this.paths !== '') {
        this.paths = this.paths.replace(/&quot;/g, '/')
        this.files = this.paths.split(',')
      }
    },
    pathToName: function (path) { // 截取文件名
      return path.split('/')[3].substring(36)
    },
    uploadFile: function () {},
    deleteFile: function (file) { // 删除文件
      this.$Modal.confirm({
        title: '',
        content: '确认删除此文件？',
        onOk: () => {
          this.files.splice(this.files.indexOf(file), 1)
        },
        onCancel: () => {
        }
      })
    },
    uploadSuccess: function (response, file, fileList) {
      console.log(response)
      console.log(file)
      console.log(fileList)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style>
</style>
