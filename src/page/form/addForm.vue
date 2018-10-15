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
              <Input v-model="formObj.title" @on-blur="checkTableName"></Input>
            </FormItem>
            <FormItem label="表单标题">
              <Input v-model="formObj.name"></Input>
            </FormItem>
            <FormItem label="表类型">
              <Select v-model="formObj.type">
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
            <draggable class="add-field-con" v-model="formControls" :options="dragToOptions">
              <FormItem v-for="(item, index) in formControls" :key="index" :label="item.title">
                <Row>
                  <Col span="14">
                    <template v-if="item.fieldType === 'textbox' || item.fieldType === 'filebox'">
                      <Input :placeholder="item.prompt"></Input>
                    </template>
                    <template v-else-if="item.fieldType === 'textboxMultiline'">
                      <Input type="textarea" :rows="item.rows" :placeholder="item.prompt"></Input>
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
                    <template v-else-if="item.fieldType === 'monthbox'">
                      <DatePicker type="month" :placeholder="item.prompt"></DatePicker>
                    </template>
                    <template v-else-if="item.fieldType === 'yearbox'">
                      <DatePicker type="year" :placeholder="item.prompt"></DatePicker>
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
                    <FormItem label="是否禁用">
                      <Select v-model="field.disabled">
                        <Option value="false">否</Option>
                        <Option value="true">是</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="是否只读">
                      <Select v-model="field.readonly">
                        <Option value="false">否</Option>
                        <Option value="true">是</Option>
                      </Select>
                    </FormItem>
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
                    <FormItem label="是否需要计算">
                      <Select v-model="field.needCalculate">
                        <Option value="false">否</Option>
                        <Option value="true">是</Option>
                      </Select>
                    </FormItem>
                    <template v-if="field.needCalculate === 'true'">
                      <FormItem label="计算方式">
                        <Select v-model="field.calculateType">
                          <Option value="multiply">乘</Option>
                          <Option value="plus">加</Option>
                          <option value="divide">除</option>
                          <option value="minus">减</option>
                        </Select>
                      </FormItem>
                      <FormItem v-show="field.calculateType === 'multiply' || field.calculateType === 'plus'" label="从哪些字段计算">
                        <Select v-model="field.calculateFields" multiple>
                          <Option v-for="item in fieldsForSelect" :value="item.text" :key="item.text">{{ item.title }}</Option>
                        </Select>
                      </FormItem>
                      <template v-show="field.calculateType === 'divide' || field.calculateType === 'minus'">
                        <FormItem label="前数">
                          <Select v-model="field.calculateFirstField">
                            <Option v-for="item in fieldsForSelect" :value="item.text" :key="item.text">{{ item.title }}</Option>
                          </Select>
                        </FormItem>
                        <FormItem label="后数">
                          <Select v-model="field.calculateLastField">
                            <Option v-for="item in fieldsForSelect" :value="item.text" :key="item.text">{{ item.title }}</Option>
                          </Select>
                        </FormItem>
                      </template>
                    </template>
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
                          {{item.disc}}
                        </Option>
                      </Select>
                    </FormItem>
                    <template v-if="field.selectType === '1' && field.selectID !== ''">
                      <FormItem class="whole-line-tablebox" label="输出参数">
                        <Table border :columns="quoteSelectInColumns" :data="quoteSelectInTableData" stripe></Table>
                      </FormItem>
                      <FormItem class="whole-line-tablebox" label="输出参数">
                        <Table border :columns="quoteSelectColumns" :data="quoteSelectTableData" stripe></Table>
                      </FormItem>
                    </template>
                  </template>
                  <template v-if="field.fieldType === 'radio'">
                    <FormItem label="选项">
                      <Input v-model="radiosText" type="textarea" :rows="5"></Input>
                      一行一个选项
                    </FormItem>
                  </template>
                  <template v-if="field.fieldType === 'checkbox'">
                    <FormItem label="选项">
                      <Input v-model="checkboxsText" type="textarea" :rows="5"></Input>
                      一行一个选项
                    </FormItem>
                  </template>
                  <template v-if="field.fieldType === 'datebox' || field.fieldType === 'datetimebox' || field.fieldType === 'monthbox' || field.fieldType === 'yearbox'">
                    <FormItem label="是否取当前时间">
                      <Select v-model="field.currentDate">
                        <Option value="false">否</Option>
                        <Option value="true">是</Option>
                      </Select>
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
              <draggable v-model="controlArray" :options="dragOptions">
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
                    <template v-else-if="item.fieldType === 'monthbox'">
                      <DatePicker type="month"></DatePicker>
                    </template>
                    <template v-else-if="item.fieldType === 'yearbox'">
                      <DatePicker type="year"></DatePicker>
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
  <Modal v-model="modalQuoteSelect" title="修改输出字段" @on-ok="saveQuoteSelectData">
    <div class="modal-field-con">
      <div>
        <Form :model="quoteSelectObj" :label-width="120">
          <FormItem label="字段名">
            <Input v-model="quoteSelectObj.name"></Input>
          </FormItem>
          <FormItem label="类型">
            <Input v-model="quoteSelectObj.type"></Input>
          </FormItem>
          <FormItem label="组件名">
            <Select v-model="quoteSelectObj.inputName">
              <Option v-for="item in formControls" :value="item.text" :key="item.text">{{ item.title }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
  <Modal v-model="modalQuoteSelectIn" title="修改输入字段" @on-ok="saveQuoteSelectInData">
    <div class="modal-field-con">
      <div>
        <Form :model="quoteSelectInObj" :label-width="120">
          <FormItem label="名称">
            <Input :value="quoteSelectInObj.name"></Input>
          </FormItem>
          <FormItem label="数据库字段">
            <Input :value="quoteSelectInObj.sql_para_name"></Input>
          </FormItem>
          <FormItem label="条件">
            <Input :value="urlInParaTypeFormat(quoteSelectInObj.type)"></Input>
          </FormItem>
          <FormItem label="是否必须">
            <Input :value="trueFalseFormat(quoteSelectInObj.is_necessary)"></Input>
          </FormItem>
          <FormItem label="组件名">
            <Select v-model="quoteSelectInObj.value">
              <Option v-for="item in urlInParaValue" :value="item.value" :key="item.value">{{ item.text }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
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
      formObj: {}, // 表单对象
      controlArray: this.$store.state.controlArray, // 字段类型列表
      formControls: [], // 表单字段
      normalSelect: this.$store.state.normalSelect, // 普通下拉选项
      quoteSelect: this.$store.state.quoteSelect, // 引用下拉选项
      urlInParaValue: this.$store.state.urlInParaValue, // 引用下拉输入参数值列表
      radiosText: '', // 单选框文本
      radioTemp: '',
      checkboxsText: '', // 多选框文本
      checkboxTemp: '',
      swiperOption: {
        allowTouchMove: false
      },
      childTables: [], // 子表数组
      quoteSelectColumns: [ // 引用输出字段表格表头
        {key: 'name', title: '字段名'},
        {key: 'type', title: '类型'},
        {key: 'inputName', title: '组件名'},
        {
          title: '操作',
          key: 'action',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editQuoteSelectData(params)
                  }
                }
              }, '修改')
            ])
          }
        }
      ],
      quoteSelectTableData: [], // 引用输出字段表格数据
      modalQuoteSelect: false,
      quoteSelectObj: {}, // 引用输出字段对象
      quoteSelectInColumns: [ // 引用输入字段表格表头
        {key: 'name', title: '名称'},
        {key: 'sql_para_name', title: '数据库字段'},
        {
          key: 'type',
          title: '条件',
          render: (h, params) => {
            return h('div', Util.urlInParaTypeFormat(params.row.type))
          }
        },
        {
          key: 'is_necessary',
          title: '是否必须',
          render: (h, params) => {
            return h('div', Util.trueFalseFormat(params.row.is_necessary))
          }
        },
        {
          key: 'value',
          title: '输入值',
          render: (h, params) => {
            return h('div', Util.urlInParaValueFormat(params.row.value))
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editQuoteSelectInData(params)
                  }
                }
              }, '修改')
            ])
          }
        }
      ],
      quoteSelectInTableData: [], // 引用输入字段表格数据
      modalQuoteSelectIn: false,
      quoteSelectInObj: {}, // 引用输入字段对象
      treeForms: [] // 树结构表单数据
    }
  },
  methods: {
    init: function () {
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
      if (this.field.fieldType === 'numberbox' && this.field.precision === undefined) {
        this.field.precision = 0
      }
      if (this.field.fieldType === 'numberbox' && this.field.calculateFields === undefined) {
        this.field.calculateFields = []
      }
      if (this.field.fieldType === 'combobox' && this.field.selectType === '1') {
        if (this.field.selectFields !== undefined) {
          this.quoteSelectTableData = this.field.selectFields
        }
        if (this.field.inParas !== undefined) {
          this.quoteSelectInTableData = this.field.inParas
        }
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
        this.field.inParas = this.quoteSelectInTableData
      }
    },
    changeQuoteSelect: function (value) { // 选择引用
      for (let variable of this.quoteSelect) {
        if (variable.name === value) {
          this.$api.post('/develop/url/getUrlById.do', {id: variable.id}, r => {
            console.log(r.data)
            this.quoteSelectTableData = r.data.urlOutputPara
            this.quoteSelectInTableData = r.data.urlIutputPara
          })
        }
      }
    },
    urlInParaTypeFormat: function (value) { // 链接输入参数条件
      return Util.urlInParaTypeFormat(value)
    },
    trueFalseFormat: function (value) { // 是否
      return Util.trueFalseFormat(value)
    },
    editQuoteSelectInData: function (params) { // 修改输入字段
      this.quoteSelectInObj = params.row
      this.modalQuoteSelectIn = true
    },
    saveQuoteSelectInData: function () { // 保存输入字段
      this.quoteSelectInTableData[this.quoteSelectInObj._index] = this.quoteSelectInObj
      console.log(this.quoteSelectInTableData)
    },
    editQuoteSelectData: function (params) { // 修改输出字段
      this.quoteSelectObj = params.row
      this.modalQuoteSelect = true
    },
    saveQuoteSelectData: function () { // 保存输出字段
      this.quoteSelectTableData[this.quoteSelectObj._index] = this.quoteSelectObj
      console.log(this.quoteSelectTableData)
    },
    checkTableName: function () { // 判断表名重复
      this.$api.post('/pages/crminterface/IsExistenceForTableName.do', {tableName: this.formObj.title}, r => {
        if (r.data) {
          this.$Message.warning('数据库表单名已存在，请更改')
        }
      })
    },
    cancel: function () {
      this.$router.go(-1)
    },
    saveForm: function () { // 保存表单
      if (this.formObj.type === '2' || this.formObj.needTree === 'true') {
        this.formControls.push({fieldType: 'textbox', text: 'pid', title: '父ID', listDisplay: false, type: 'int'})
      }
      this.formObj.field = Util.fieldsAddType(this.formControls)
      let infoStr = JSON.stringify(this.formObj)
      console.log(infoStr)
      this.$api.post('/pages/crminterface/creatTable.do', {jsonStr: infoStr}, r => {
        if (r.data) {
          this.$Message.success('新建表单成功')
          this.$router.go(-1)
        } else {
          this.$Message.error('新建表单失败')
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
        },
        sort: false
      }
    },
    dragToOptions () {
      return {
        group: {
          put: ['controlTo']
        }
      }
    },
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    fieldsForSelect () {
      return Util.fieldsForSelect(this.formControls)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style>
</style>
