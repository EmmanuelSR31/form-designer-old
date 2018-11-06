<template>
<div class="form-con">
  <Row>
    <Col span="24">
      <div :class="formClass">
        <Form :model="formDataObj" :label-width="120">
          <FormItem v-for="(item, index) in formControls" :key="index" :class="['whole-line-'+item.width, 'whole-line-'+item.fieldType]" :label="item.title">
            <template v-if="item.fieldType === 'textbox'">
              <Input v-model="formDataObj[item.text]" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></Input>
            </template>
            <template v-else-if="item.fieldType === 'textboxMultiline'">
              <Input type="textarea" v-model="formDataObj[item.text]" :rows="item.rows" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></Input>
            </template>
            <template v-else-if="item.fieldType === 'numberbox'">
              <template v-if="item.needCalculate === 'true'">
                <template v-if="item.precision !== ''">
                  <InputNumber :value="numberCalculate(item)" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :precision="Number(item.precision)" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
                <template v-else>
                  <InputNumber :value="numberCalculate(item)" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
              </template>
              <template v-else>
                <template v-if="item.precision !== ''">
                  <InputNumber v-model="formDataObj[item.text]" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :precision="Number(item.precision)" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
                <template v-else>
                  <InputNumber v-model="formDataObj[item.text]" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
              </template>
            </template>
            <template v-else-if="item.fieldType === 'combobox'">
              <Select v-model="formDataObj[item.text]" :multiple="item.multiple" :placeholder="item.prompt" :disabled="method === 'view' ? true : strToBool(item.disabled)" @on-change="changeQuoteSelectData(item)" :key="item.text">
                <Option v-for="tmp in selectData[item.selectID]" :value="tmp.id + ''" :key="tmp.id" :label="tmp.text"></Option>
              </Select>
            </template>
            <template v-else-if="item.fieldType === 'radio'">
              <RadioGroup v-model="formDataObj[item.text]">
                <Radio v-for="(radioItem, index) in item.radios" :key="index" :label="radioItem" :disabled="method === 'view' ? true : strToBool(item.disabled)"></Radio>
              </RadioGroup>
            </template>
            <template v-else-if="item.fieldType === 'checkbox'">
              <CheckboxGroup v-model="formDataObj[item.text]">
                <Checkbox v-for="(checkboxItem, index) in item.checkboxs" :key="index" :label="checkboxItem" :disabled="method === 'view' ? true : strToBool(item.disabled)"></Checkbox>
              </CheckboxGroup>
            </template>
            <template v-else-if="item.fieldType === 'switch'">
              <i-switch v-model="formDataObj[item.text]" :key="item.text" :disabled="method === 'view' ? true : strToBool(item.disabled)"></i-switch>
            </template>
            <template v-else-if="item.fieldType === 'datebox'">
              <template v-if="item.currentDate === 'true' && method === 'add'">
                <DatePicker type="date" :value="currentDate" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
              <template v-else>
                <DatePicker type="date" :value="formDataObj[item.text]" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
            </template>
            <template v-else-if="item.fieldType === 'datetimebox'">
              <template v-if="item.currentDate === 'true' && method === 'add'">
                <DatePicker type="datetime" :value="currentDate" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
              <template v-else>
                <DatePicker type="datetime" :value="formDataObj[item.text]" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
            </template>
            <template v-else-if="item.fieldType === 'monthbox'">
              <template v-if="item.currentDate === 'true' && method === 'add'">
                <DatePicker type="month" :value="currentDate" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
              <template v-else>
                <DatePicker type="month" :value="formDataObj[item.text]" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
            </template>
            <template v-else-if="item.fieldType === 'yearbox'">
              <template v-if="item.currentDate === 'true' && method === 'add'">
                <DatePicker type="year" :value="currentDate" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
              <template v-else>
                <DatePicker type="year" :value="formDataObj[item.text]" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="method === 'view' ? true : strToBool(item.readonly)" :key="item.text"></DatePicker>
              </template>
            </template>
            <template v-else-if="item.fieldType === 'tablebox'">
              <childTable :childTableName="item.tableTitle" :recordID="formDataObj.uuid"></childTable>
            </template>
            <template v-else-if="item.fieldType === 'filebox'">
              <template v-if="method === 'view'">
                <Button type="ghost" @click="openUpload(item)">查看</Button>
              </template>
              <template v-else>
                <Upload multiple action="/apis/upload/file?fileType=file" :show-upload-list="false" :before-upload="handleBeforeUpload(item.text)" :on-success="uploadSuccess">
                  <Button type="primary" icon="ios-cloud-upload-outline">上传</Button>
                </Upload>
                <ul class="form-file-list">
                  <li v-for="(file, index) in fileList[item.text]" :key="index">
                    <Button @click="deleteFile(item.text, file)">删除</Button><a href="file">{{file}}</a>
                  </li>
                </ul>
                <Input v-model="formDataObj[item.text]" :key="item.text"><Button slot="append" icon="md-cloud-upload" @click="openUpload(item)"></Button></Input>
              </template>
            </template>
          </FormItem>
        </Form>
      </div>
      <div class="text-center">
        <Button class="mr100" @click="cancel">取消</Button>
        <Button type="primary" @click="save">保存</Button>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
import childTable from './childTable/childTable.vue'
import filesManage from './fileManage/filesManage.vue'
export default {
  components: {
    childTable // 子表组件
  },
  data () {
    return {
      tableName: this.$route.params.tableName, // 表单名
      id: this.$route.params.id, // 数据ID
      pid: this.$route.params.pid, // 父ID
      method: this.$route.params.method, // 方法
      formControls: [], // 表单字段
      formObj: this.$store.state.currentEditForm, // 表单对象
      formDataObj: this.$store.state.currentEditFormData, // 表单数据对象
      selectData: this.$store.state.selectData, // 下拉数据
      fileList: {}, // 附件列表
      currentUploadField: '' // 正在上传附件的字段
    }
  },
  methods: {
    /**
    * @desc 返回
    */
    cancel: function () {
      this.$router.go(-1)
    },
    /**
    * @desc 保存
    */
    save: function () {
      let obj = {}
      obj.title = this.tableName
      delete this.formDataObj.uuid
      obj.field = Util.getFormValues(this.formDataObj)
      if (this.method === 'add') {
        obj.field.push({text: 'create_user_id', value: '0'})
        obj.field.push({text: 'taskid', value: '0'})
        if (this.formObj.needTree === 'true' && this.pid !== '' && this.pid !== null) {
          obj.field.push({text: 'pid', value: '\'' + this.pid + '\''})
        }
        let jsonStr = JSON.stringify(obj)
        console.log(jsonStr)
        this.$api.post('/crm/ActionFormUtil/insert.do', {jsonStr: jsonStr}, r => {
          if (r.data === 1) {
            this.$Message.success('新增数据成功')
            this.$router.go(-1)
          } else {
            this.$Message.error('新增数据失败')
          }
        })
      } else if (this.method === 'edit') {
        let jsonStr = JSON.stringify(obj)
        console.log(jsonStr)
        this.$api.post('/crm/ActionFormUtil/update.do', {jsonStr: jsonStr, id: this.id}, r => {
          if (r.data === 1) {
            this.$Message.success('修改数据成功')
            this.$router.go(-1)
          } else {
            this.$Message.error('修改数据失败')
          }
        })
      }
    },
    /**
    * @desc 初始化
    */
    init: function () {
      this.formControls = Util.removeFieldTable(this.formObj.field)
      if (['edit', 'view'].includes(this.method)) {
        this.formDataObj = Util.formatFormData(this.formControls, this.formDataObj)
        this.fileList = Util.formatFieldFile(this.formControls, this.formDataObj)
      } else if (this.method === 'add') {
        this.formDataObj = Util.fieldArrToObj(this.formControls)
        this.formDataObj.uuid = Util.uuid()
      }
    },
    /**
    * @desc 引用下拉写入其他字段
    * @param {Object} field 引用下拉字段
    */
    changeQuoteSelectData: function (field) {
      if (field.selectType === '1' & field.selectFields !== '') {
        if (field.selectFields.length > 0) {
          let temp = {}
          for (let variable of this.selectData[field.selectID]) {
            if (variable.id === this.formDataObj[field.text]) {
              temp = variable
              break
            }
          }
          for (let variable of field.selectFields) {
            let tmp = variable.name
            this.formDataObj[variable.inputName] = temp[tmp]
          }
        }
      }
    },
    /**
    * @desc 打开附件上传
    * @param {Object} field 附件字段
    */
    openUpload: function (field) {
      let paths = this.formDataObj[field.text].replace(/\//g, '&quot;')
      console.log(paths)
      this.$layer.open({
        type: 2,
        content: {
          content: filesManage, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            field: field.text,
            paths: paths
          }
        },
        shadeClose: false,
        shade: false,
        maxmin: true,
        area: ['800px', document.body.clientHeight - 20 + 'px'],
        title: '附件上传'
      })
    },
    /**
    * @desc 删除附件
    * @param {Object} field 附件字段
    * @param {Object} file 附件
    */
    deleteFile: function (field, file) {
      this.$Modal.confirm({
        title: '',
        content: '确认删除此文件？',
        onOk: () => {
          this.fileList[field].splice(this.fileList[field].indexOf(file), 1)
        },
        onCancel: () => {
        }
      })
    },
    /**
    * @desc 点击上传设置附件字段
    * @param {Object} field 附件字段
    */
    handleBeforeUpload: function (field) {
      this.currentUploadField = field
    },
    /**
    * @desc 上传成功
    * @param {Object} response 返回对象
    */
    uploadSuccess: function (response, file, fileList) {
      console.log(response)
      console.log(this.currentUploadField)
      this.fileList[this.currentUploadField].push(response.obj.filePath)
    },
    /**
    * @desc string转为Boolean
    * @param {String} str 字符串
    * @return {Boolean} 布尔值
    */
    strToBool: function (str) { // string转为Boolean
      return Util.strToBool(str)
    },
    /**
    * @desc 数字字段值计算
    * @param {Object} field 数字字段
    */
    numberCalculate: function (field) {
      let count = 0
      if (field.calculateType === 'multiply' || field.calculateType === 'plus') {
        for (let i = 0; i < field.calculateFields.length; i++) {
          let temp = field.calculateFields[i]
          if (i === 0) {
            count = this.formDataObj[temp]
          } else {
            if (field.calculateType === 'multiply') {
              count = Util.FloatMul(count, this.formDataObj[temp])
            } else if (field.calculateType === 'plus') {
              count = Util.FloatAdd(count, this.formDataObj[temp])
            }
          }
        }
      } else if (field.calculateType === 'divide') {
        count = Util.FloatDiv(this.formDataObj[field.calculateFirstField], this.formDataObj[field.calculateLastField])
      } else if (field.calculateType === 'minus') {
        count = Util.FloatSub(this.formDataObj[field.calculateFirstField], this.formDataObj[field.calculateLastField])
      }
      this.formDataObj[field.text] = count
      return count
    }
  },
  computed: {
    formClass () { // 表单排列样式
      if (Util.isEmpty(this.formObj.columnNumber)) {
        this.formObj.columnNumber = '1'
      }
      return 'form-column-' + this.formObj.columnNumber
    },
    currentDate () { // 当前日期
      return Util.getCurrentDate()
    }
  },
  mounted () {
    this.init()
  },
  beforeRouteLeave (to, from, next) {
    // 离开页面时确认
    this.$Modal.confirm({
      title: '',
      content: '数据未保存，确认离开此页？',
      onOk: () => {
        next()
      },
      onCancel: () => {
      }
    })
  }
}
</script>
