<template>
<div>
  <Row>
    <Col :lg="{span: 12, offset: 6}" :md="{span: 18, offset: 3}">
      <Form :model="systemObj" :label-width="120">
        <FormItem label="系统名称">
          <Input v-model="systemObj.system_name"></Input>
        </FormItem>
        <FormItem label="系统图标">
          <Input v-show="false" v-model="systemObj.system_icon"></Input>
          <img v-if="systemObj.system_icon !== '' && systemObj.system_icon !== undefined" :src="iconPath" height="40">
          <Upload action="/apis/upload/file?fileType=img" :show-upload-list="false" :on-success="uploadSuccess">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
          </Upload>
        </FormItem>
        <FormItem label="工作区名称">
          <Input v-model="systemObj.workspace_name"></Input>
        </FormItem>
      </Form>
      <div class="text-center">
        <Button type="primary" @click="save">保存</Button>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
export default {
  data () {
    return {
      systemObj: {} // 系统设置对象
    }
  },
  methods: {
    /**
    * @desc 初始化
    */
    init: function () {
      this.$api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: 'system_set'}, r => {
        if (r.data.rows.length > 0) {
          this.systemObj = r.data.rows[0]
        } else {
          let obj = {}
          obj.title = 'system_set'
          obj.field = []
          obj.field.push({'text': 'system_name', 'value': '\'\''})
          obj.field.push({'text': 'system_icon', 'value': '\'\''})
          obj.field.push({'text': 'workspace_name', 'value': '\'\''})
          let infoStr = JSON.stringify(obj)
          this.$api.post('/crm/ActionFormUtil/insert.do', {jsonStr: infoStr}, r => {})
        }
      })
    },
    /**
    * @desc 保存
    */
    save: function () {
      let obj = {}
      obj.title = 'system_set'
      obj.field = []
      obj.field.push({'text': 'system_name', 'value': '\'' + this.systemObj.system_name + '\''})
      obj.field.push({'text': 'system_icon', 'value': '\'' + this.systemObj.system_icon + '\''})
      obj.field.push({'text': 'workspace_name', 'value': '\'' + this.systemObj.workspace_name + '\''})
      let infoStr = JSON.stringify(obj)
      this.$api.post('/crm/ActionFormUtil/update.do', {jsonStr: infoStr, id: 1}, r => {
        if (r.data === 1) {
          this.$Message.success('修改设置成功')
        } else {
          this.$Message.error('修改设置失败')
        }
      })
    },
    /**
    * @desc 上传成功
    * @param {Object} response 返回对象
    */
    uploadSuccess: function (response, file, fileList) {
      this.systemObj.system_icon = response.obj.filePath
    }
  },
  computed: {
    iconPath () { // 系统图标路径
      return '/apis' + this.systemObj.system_icon
    }
  },
  mounted () {
    this.init()
  }
}
</script>
