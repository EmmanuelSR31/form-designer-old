<template>
<div>
  <div class="form-step-con">
    <Steps :current="currentStep">
      <Step title="设置表单属性"></Step>
      <Step title="设置表单字段"></Step>
    </Steps>
  </div>
  <swiper :options="swiperOption" ref="mySwiper">
    <swiper-slide>
      <Row>
        <Col span="12" offset="6">
          <Form :model="formObj" :label-width="120">
            <FormItem label="数据库表名">
              <Input v-model="formObj.title" readonly></Input>
            </FormItem>
            <FormItem label="表单标题">
              <Input v-model="formObj.name"></Input>
            </FormItem>
            <FormItem label="表类型">
              <Select v-model="formObj.type" disabled>
                <Option value="0">主表</Option>
                <Option value="1">子表</Option>
                <Option value="2">树形表</Option>
              </Select>
            </FormItem>
            <FormItem label="表单列数">
              <Select v-model="formObj.columnNumber">
                <Option value="1">每行1列</Option>
                <Option value="2">每行2列</Option>
                <Option value="3">每行3列</Option>
                <Option value="4">每行4列</Option>
              </Select>
            </FormItem>
            <FormItem label="树节点字段" v-if="formObj.type === '2'">
              <Select v-model="formObj.treeField">
                <Option v-for="item in formControls" :value="item.text" :key="item.text">{{item.title}}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否需要树结构" v-if="formObj.type !== '2'">
              <Select v-model="formObj.needTree">
                <Option value="false">否</Option>
                <Option value="true">是</Option>
              </Select>
            </FormItem>
            <FormItem label="树结构表单" v-if="formObj.needTree === 'true' && formObj.type !== '2'">
              <Select v-model="formObj.treeForm">
                <Option v-for="item in treeForms" :value="item.title" :key="item.title">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <div class="text-center">
        <Button class="mr100" @click="cancel">取消</Button>
        <Button type="primary" @click="nextStep">下一步</Button>
      </div>
    </swiper-slide>
    <swiper-slide>
      <Row>
        <Col span="12">
          <Form :label-width="150">
            <draggable class="add-field-con" v-model="formControls" @end="leftDragEnd" :options="dragToOptions">
              <FormItem v-for="(item, index) in formControls" :key="index" :label="item.title">
                <Row>
                  <Col span="14">
                    <template v-if="item.fieldType === 'textbox' || item.fieldType === 'filebox'">
                      <Input :placeholder="item.prompt"></Input>
                    </template>
                    <template v-else-if="item.fieldType === 'textboxMultiline'">
                      <Input type="textarea" :rows="item.height/32" :placeholder="item.prompt"></Input>
                    </template>
                    <template v-else-if="item.fieldType === 'numberbox'">
                      <InputNumber :min="item.min" :max="item.max" :precision="item.precision" :placeholder="item.prompt"></InputNumber>
                    </template>
                    <template v-else-if="item.fieldType === 'combobox'">
                      <Select :multiple="item.multiple" :placeholder="item.prompt">
                        <Option value="1">请选择</Option>
                      </Select>
                    </template>
                    <template v-else-if="item.fieldType === 'radio'">
                      <RadioGroup v-model="radioTemp">
                        <Radio v-for="(radioItem, index) in item.radios" :key="index" :label="radioItem"></Radio>
                      </RadioGroup>
                    </template>
                    <template v-else-if="item.fieldType === 'checkbox'">
                      <CheckboxGroup v-model="checkboxTemp">
                      <Checkbox v-for="(checkboxItem, index) in item.checkboxs" :key="index" :label="checkboxItem"></Checkbox>
                      </CheckboxGroup>
                    </template>
                    <template v-else-if="item.fieldType === 'switch'">
                      <i-switch></i-switch>
                    </template>
                    <template v-else-if="item.fieldType === 'datebox'">
                      <DatePicker type="date" :placeholder="item.prompt"></DatePicker>
                    </template>
                    <template v-else-if="item.fieldType === 'datetimebox'">
                      <DatePicker type="datetime" :placeholder="item.prompt"></DatePicker>
                    </template>
                    <template v-else-if="item.fieldType === 'tablebox'">
                      <Table></Table>
                    </template>
                  </Col>
                  <Col span="10" class="text-center">
                    <Button @click="showSet(item)">设置</Button>
                    <Button type="error" @click="deleteField(item)">删除</Button>
                  </Col>
                </Row>
              </FormItem>
            </draggable>
          </Form>
          <Modal v-model="modalField" title="设置字段属性" width="900" @on-ok="saveField">
            <div class="modal-field-con">
              <div class="modal-field-2">
                <Form ref="formField" :model="field" :label-width="120">
                  <FormItem label="数据库字段名">
                    <Input v-model="field.text"></Input>
                  </FormItem>
                  <FormItem label="字段标题">
                    <Input v-model="field.title"></Input>
                  </FormItem>
                  <template v-if="field.fieldType !== 'tablebox'">
                    <FormItem label="字段宽度">
                      <Select v-model="field.width">
                        <Option v-if="field.fieldType !== 'textboxMultiline'" value="278">普通</Option>
                        <Option value="703">整行</Option>
                      </Select>
                    </FormItem>
                    <template v-if="field.fieldType === 'textboxMultiline'">
                      <FormItem label="字段高度">
                        <Select v-model="field.height">
                          <Option value="32">一行</Option>
                          <Option value="64">两行</Option>
                          <Option value="96">三行</Option>
                          <Option value="128">四行</Option>
                          <Option value="160">五行</Option>
                        </Select>
                      </FormItem>
                    </template>
                    <FormItem label="是否必填">
                      <Select v-model="field.required">
                        <Option value="false">否</Option>
                        <Option value="true">是</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="是否列表显示">
                      <Select v-model="field.listDisplay">
                        <Option value="true">是</Option>
                        <Option value="false">否</Option>
                      </Select>
                    </FormItem>
                    <template v-if="field.fieldType !== 'radio' && field.fieldType !== 'checkbox' && field.fieldType !== 'switch'">
                      <FormItem label="提示信息">
                        <Input v-model="field.prompt"></Input>
                      </FormItem>
                    </template>
                  </template>
                  <!-- <template v-if="field.fieldType === 'textboxMultiline'">
                    <FormItem label="文本域行数">
                      <Slider v-model="field.rows" :min="1" :max="5"></Slider>
                    </FormItem>
                  </template> -->
                  <template v-if="field.fieldType === 'numberbox'">
                    <FormItem label="最小值">
                      <Input v-model="field.min"></Input>
                    </FormItem>
                    <FormItem label="最大值">
                      <Input v-model="field.max"></Input>
                    </FormItem>
                    <FormItem label="数值精度">
                      <InputNumber v-model="field.precision" :min="0" :step="1"></InputNumber>
                    </FormItem>
                  </template>
                  <template v-if="field.fieldType === 'combobox'">
                    <FormItem label="是否支持多选">
                      <i-switch v-model="field.multiple"></i-switch>
                    </FormItem>
                    <FormItem label="选项来源">
                      <Select v-model="field.selectType">
                        <Option value="0">普通</Option>
                        <Option value="1">引用</Option>
                      </Select>
                    </FormItem>
                    <FormItem v-if="field.selectType === '0'" label="关联选项">
                      <Select v-model="field.selectID">
                        <Option v-for="(item, index) in normalSelect" :key="index" :value="item.table_name">
                          {{item.title}}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem v-if="field.selectType === '1'" label="关联选项">
                      <Select v-model="field.selectID" @on-change="changeQuoteSelect">
                        <Option v-for="(item, index) in quoteSelect" :key="index" :value="item.name">
                          {{item.descr}}
                        </Option>
                      </Select>
                    </FormItem>
                    <FormItem v-if="field.selectType === '1' && field.selectID !== ''" class="whole-line-tablebox" label="">
                      <v-table is-horizontal-resize style="width:100%" :columns="quoteSelectColumns" :table-data="quoteSelectTableData" row-hover-color="#eee" row-click-color="#edf7ff" :cell-edit-done="cellEditDone"></v-table>
                    </FormItem>
                  </template>
                  <template v-if="field.fieldType === 'radio'">
                    <FormItem label="选项">
                      <Input v-model="radiosText" type="textarea" :rows="5"></Input>
                    </FormItem>
                    <FormItem label="">
                      一行一个选项
                    </FormItem>
                  </template>
                  <template v-if="field.fieldType === 'checkbox'">
                    <FormItem label="选项">
                      <Input v-model="checkboxsText" type="textarea" :rows="5"></Input>
                    </FormItem>
                    <FormItem label="">
                      一行一个选项
                    </FormItem>
                  </template>
                  <template v-if="field.fieldType === 'tablebox'">
                    <FormItem label="子表">
                      <Select v-model="field.tableTitle">
                        <Option v-for="item in childTables" :value="item.title" :key="item.title">{{ item.name }}</Option>
                      </Select>
                    </FormItem>
                  </template>
                </Form>
                <div class="clear"></div>
              </div>
            </div>
          </Modal>
        </Col>
        <Col span="10" offset="2">
          <div class="controls-con">
            <Form :label-width="120">
              <draggable v-model="controlArray" @end="dragEnd" :options="dragOptions">
                <transition-group>
                  <FormItem v-for="(item, index) in controlArray" :key="index" :label="item.title">
                    <template v-if="item.fieldType === 'textbox' || item.fieldType === 'filebox'">
                      <Input></Input>
                    </template>
                    <template v-else-if="item.fieldType === 'textboxMultiline'">
                      <Input type="textarea" :rows="2"></Input>
                    </template>
                    <template v-else-if="item.fieldType === 'numberbox'">
                      <InputNumber></InputNumber>
                    </template>
                    <template v-else-if="item.fieldType === 'combobox'">
                      <Select>
                        <Option value="1">请选择</Option>
                      </Select>
                    </template>
                    <template v-else-if="item.fieldType === 'radio'">
                      <Radio>单选框</Radio>
                    </template>
                    <template v-else-if="item.fieldType === 'checkbox'">
                      <Checkbox>多选框</Checkbox>
                    </template>
                    <template v-else-if="item.fieldType === 'switch'">
                      <i-switch></i-switch>
                    </template>
                    <template v-else-if="item.fieldType === 'datebox'">
                      <DatePicker type="date"></DatePicker>
                    </template>
                    <template v-else-if="item.fieldType === 'datetimebox'">
                      <DatePicker type="datetime"></DatePicker>
                    </template>
                    <template v-else-if="item.fieldType === 'tablebox'">
                      <Table></Table>
                    </template>
                  </FormItem>
                </transition-group>
              </draggable>
            </Form>
          </div>
        </Col>
      </Row>
      <div class="text-center">
        <Button class="mr100" @click="cancel">取消</Button>
        <Button type="primary" class="mr100" @click="prevStep">上一步</Button>
        <Button type="primary" @click="saveForm">保 存</Button>
      </div>
    </swiper-slide>
  </swiper>
</div>
</template>
<script>
import draggable from 'vuedraggable'
import Util from '@/utils/index'
export default {
  components: {
    draggable
  },
  data () {
    return {
      modalField: false,
      currentStep: 0, // 步骤
      field: {}, // 当前字段
      formObj: this.$store.state.currentEditForm, // 表单对象
      controlArray: this.$store.state.controlArray, // 字段类型列表
      formControls: [], // 表单字段
      normalSelect: this.$store.state.normalSelect, // 普通下拉选项
      quoteSelect: this.$store.state.quoteSelect, // 引用下拉选项
      radiosText: '', // 单选框文本
      radioTemp: '',
      checkboxsText: '', // 多选框文本
      checkboxTemp: '',
      swiperOption: {
        allowTouchMove: false
      },
      childTables: [], // 子表数组
      quoteSelectColumns: [ // 引用输出字段表格表头
        {field: 'name', title: '字段名', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
        {field: 'type', title: '类型', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true},
        {field: 'inputName', title: '组件名', width: 150, titleAlign: 'center', columnAlign: 'center', isEdit: true, isResize: true}
      ],
      quoteSelectTableData: [], // 引用输出字段表格数据
      treeForms: [] // 树结构表单数据
    }
  },
  methods: {
    init: function () {
      this.formControls = Util.removeFieldTable(this.formObj.field)
      this.$api.post('/crm/ActionFormUtil/getChildTableByType.do', {}, r => { // 取所有子表
        if (r.data) {
          this.childTables = r.data.rows
        }
      })
      this.$api.post('/crm/ActionFormUtil/getByType.do', {type: 2}, r => { // 取树结构表单
        if (r.data) {
          this.treeForms = r.data
        }
      })
    },
    prevStep: function () {
      this.currentStep = 0
      this.swiper.slidePrev()
    },
    nextStep: function () {
      this.currentStep = 1
      this.swiper.slideNext()
    },
    dragEnd: function (evt) {
      let type = evt.item.innerText
      let arr = Util.copyArr(this.controlArray)
      if (type.indexOf('多行文本输入框') !== -1) {
        this.formControls.push(arr[1])
      } else if (type.indexOf('文本输入框') !== -1) {
        this.formControls.push(arr[0])
      } else if (type.indexOf('数字输入框') !== -1) {
        this.formControls.push(arr[2])
      } else if (type.indexOf('下拉选择器') !== -1) {
        this.formControls.push(arr[3])
      } else if (type.indexOf('单选框') !== -1) {
        this.formControls.push(arr[4])
      } else if (type.indexOf('多选框') !== -1) {
        this.formControls.push(arr[5])
      } else if (type.indexOf('开关选择器') !== -1) {
        this.formControls.push(arr[6])
      } else if (type.indexOf('日期选择器') !== -1) {
        this.formControls.push(arr[7])
      } else if (type.indexOf('日期时间选择器') !== -1) {
        this.formControls.push(arr[8])
      } else if (type.indexOf('子表') !== -1) {
        this.formControls.push(arr[9])
      } else if (type.indexOf('附件上传') !== -1) {
        this.formControls.push(arr[10])
      }
    },
    leftDragEnd: function (event) {
      // console.log(this.formControls)
    },
    showSet: function (item) { // 开始设置字段属性
      this.field = item
      if (item.radios) {
        this.radiosText = item.radios.join('\n')
      } else {
        this.radiosText = ''
      }
      if (item.checkboxs) {
        this.checkboxsText = item.checkboxs.join('\n')
      } else {
        this.checkboxsText = ''
      }
      if (this.field.fieldType === 'numberbox' && this.field.precision === 'undefined') {
        this.field.precision = 0
      }
      if (this.field.fieldType === 'combobox' && this.field.selectType === '1') {
        this.quoteSelectTableData = this.field.selectFields
      }
      this.modalField = true
    },
    deleteField: function (item) { // 删除字段
      this.$Modal.confirm({
        title: '',
        content: '确认删除此字段？',
        onOk: () => {
          this.formControls.splice(this.formControls.indexOf(item), 1)
        },
        onCancel: () => {
        }
      })
    },
    saveField: function () { // 保存字段属性
      this.field.radios = this.radiosText.split('\n')
      this.field.checkboxs = this.checkboxsText.split('\n')
      if (this.field.fieldType === 'combobox' && this.field.selectType === '1') {
        this.field.selectFields = this.quoteSelectTableData
      }
    },
    changeQuoteSelect: function (value) { // 选择引用
      for (let variable of this.quoteSelect) {
        if (variable.name === value) {
          this.$api.post('/develop/url/getUrlById.do', {id: variable.id}, r => {
            this.quoteSelectTableData = r.data.urlOutputPara
          })
        }
      }
    },
    cellEditDone: function (newValue, oldValue, rowIndex, rowData, field) {
      this.quoteSelectTableData[rowIndex][field] = newValue
      console.log(this.quoteSelectTableData)
    },
    cancel: function () {
      this.$router.go(-1)
    },
    saveForm: function () { // 保存表单
      delete this.formObj.str_json
      delete this.formObj.id
      delete this.formObj._index
      delete this.formObj._rowKey
      if (this.formObj.type === '2') {
        this.formControls.push({fieldType: 'textbox', text: 'pid', title: '父ID', listDisplay: false, type: 'int'})
      }
      this.formObj.field = Util.fieldsAddType(this.formControls)
      let infoStr = JSON.stringify(this.formObj)
      console.log(infoStr)
      this.$api.post('/pages/crminterface/creatTable.do', {jsonStr: infoStr}, r => {
        if (r.data) {
          this.$Message.success('修改表单成功')
          this.$router.go(-1)
        } else {
          this.$Message.error('修改表单失败')
        }
      })
    }
  },
  computed: {
    dragOptions () {
      return {
        group: {
          name: 'controlTo',
          pull: 'clone'
        }
      }
    },
    dragToOptions () {
      return {
        group: 'control',
        containment: 'parent'
      }
    },
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style>
</style>
