<template>
<div class="form-con">
  <Row>
    <Col span="24">
      <div :class="formClass">
        <Form :model="formDataObj" :label-width="120">
          <FormItem v-for="(item, index) in formControls" :key="index" :class="['whole-line-'+item.width, 'whole-line-'+item.fieldType]" :label="item.title">
            <template v-if="item.fieldType === 'textbox'">
              <Input v-model="formDataObj[item.text]" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></Input>
            </template>
            <template v-else-if="item.fieldType === 'textboxMultiline'">
              <Input type="textarea" v-model="formDataObj[item.text]" :rows="item.rows" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></Input>
            </template>
            <template v-else-if="item.fieldType === 'numberbox'">
              <template v-if="item.needCalculate === 'true'">
                <template v-if="item.precision !== ''">
                  <InputNumber :value="numberCalculate(item)" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :precision="Number(item.precision)" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
                <template v-else>
                  <InputNumber :value="numberCalculate(item)" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
              </template>
              <template v-else>
                <template v-if="item.precision !== ''">
                  <InputNumber v-model="formDataObj[item.text]" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :precision="Number(item.precision)" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
                <template v-else>
                  <InputNumber v-model="formDataObj[item.text]" :min="item.min !== '' ? Number(item.min) : -Infinity" :max="item.max !== '' ? Number(item.max) : Infinity" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></InputNumber>
                </template>
              </template>
            </template>
            <template v-else-if="item.fieldType === 'combobox'">
              <Select v-model="formDataObj[item.text]" :multiple="item.multiple" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" @on-change="changeQuoteSelectData(item)" :key="item.text">
                <Option v-for="tmp in selectData[item.selectID]" :value="tmp.id + ''" :key="tmp.id" :label="tmp.text"></Option>
              </Select>
            </template>
            <template v-else-if="item.fieldType === 'radio'">
              <RadioGroup v-model="formDataObj[item.text]">
                <Radio v-for="(radioItem, index) in item.radios" :key="index" :label="radioItem" :disabled="strToBool(item.disabled)"></Radio>
              </RadioGroup>
            </template>
            <template v-else-if="item.fieldType === 'checkbox'">
              <CheckboxGroup v-model="formDataObj[item.text]">
                <Checkbox v-for="(checkboxItem, index) in item.checkboxs" :key="index" :label="checkboxItem" :disabled="strToBool(item.disabled)"></Checkbox>
              </CheckboxGroup>
            </template>
            <template v-else-if="item.fieldType === 'switch'">
              <i-switch v-model="formDataObj[item.text]" :key="item.text" :disabled="strToBool(item.disabled)"></i-switch>
            </template>
            <template v-else-if="item.fieldType === 'datebox'">
              <DatePicker type="date" :value="formDataObj[item.text]" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></DatePicker>
            </template>
            <template v-else-if="item.fieldType === 'datetimebox'">
              <DatePicker type="datetime" :value="formDataObj[item.text]" @on-change="formDataObj[item.text]=$event" :placeholder="item.prompt" :disabled="strToBool(item.disabled)" :readonly="strToBool(item.readonly)" :key="item.text"></DatePicker>
            </template>
            <template v-else-if="item.fieldType === 'tablebox'">
              <childTable :childTableName="item.tableTitle" :recordID="formDataObj.uuid"></childTable>
            </template>
            <template v-else-if="item.fieldType === 'filebox'">
              <Input v-model="formDataObj[item.text]" :key="item.text"><Button slot="append" icon="ios-upload-outline" @click="openUpload(item)"></Button></Input>
            </template>
          </FormItem>
          <FormItem  v-if="pid !== 0" label="上级">
            <Input v-model="pdata" readonly></Input>
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
import childTable from '../childTable/childTable.vue'
import filesManage from '../fileManage/filesManage.vue'
export default {
  components: {
    childTable
  },
  data () {
    return {
      tableName: this.$route.params.tableName, // 表单名
      id: this.$route.params.id, // 数据ID
      formControls: [], // 表单字段
      formObj: this.$store.state.currentEditForm, // 表单对象
      formDataObj: this.$store.state.currentEditFormData, // 表单数据对象
      selectData: this.$store.state.selectData, // 下拉数据
      pdata: '' // 父数据
    }
  },
  methods: {
    cancel: function () {
      this.$router.go(-1)
    },
    save: function () {
      let obj = {}
      obj.title = this.tableName
      delete this.formDataObj.uuid
      delete this.formDataObj.pid
      obj.field = Util.getFormValues(this.formDataObj)
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
    },
    init: function () {
      this.formControls = Util.removeFieldTable(this.formObj.field)
      this.formDataObj = Util.formatFormData(this.formControls, this.formDataObj)
      delete this.formDataObj.children
      if (this.formDataObj.pid !== 0) { // 初始化上级数据
        this.$api.post('/crm/ActionFormUtil/getDataById.do', {tableName: this.tableName, id: this.formDataObj.pid}, r => {
          let temp = r.data.rows[0]
          this.pdata = temp[this.formObj.treeField]
        })
      }
    },
    changeQuoteSelectData: function (field) { // 引用下拉写入其他字段
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
    openUpload: function (field) { // 打开附件上传
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
    strToBool: function (str) { // string转为Boolean
      return Util.strToBool(str)
    },
    numberCalculate: function (field) { // number字段值计算
      let count = 0
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
      this.formDataObj[field.text] = count
      return count
    }
  },
  computed: {
    formClass () {
      if (Util.isEmpty(this.formObj.columnNumber)) {
        this.formObj.columnNumber = '1'
      }
      return 'form-column-' + this.formObj.columnNumber
    }
  },
  mounted () {
    this.init()
  }
}
</script>
