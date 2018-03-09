<template>
  <div class="form-con">
    <Row>
      <Col span="22" offset="1">
        <Form :model="formObj" :label-width="120">
          <FormItem label="数据库表名">
            <Input v-model="formObj.title" readonly></Input>
          </FormItem>
          <FormItem label="表格表头">
            <div class="table-search-con">
              <Button type="primary" @click="columnsAdd">新增</Button>
            </div>
            <Table border :columns="columnsColumns" :data="formColumns" stripe></Table>
          </FormItem>
          <FormItem label="表格按钮">
            <div class="table-search-con">
              <Button type="primary" @click="buttonsAdd">新增</Button>
            </div>
            <Table border :columns="buttonsColumns" :data="formButtons" stripe></Table>
          </FormItem>
          <FormItem label="搜索栏">
            <div class="table-search-con">
              <Button type="primary" @click="searchsAdd">新增</Button>
            </div>
            <Table border :columns="searchsColumns" :data="formSearchs" stripe></Table>
          </FormItem>
          <FormItem label="搜索按钮">
            <div class="table-search-con">
              <Button type="primary" @click="searchButtonsAdd">新增</Button>
            </div>
            <Table border :columns="searchButtonsColumns" :data="formSearchButtons" stripe></Table>
          </FormItem>
          <FormItem label="JS代码">
            <codemirror v-model="jsCode" :options="cmOptions"></codemirror>
            <div class="tip-text">表格ID为“dg”,代码中请勿使用单引号。</div>
          </FormItem>
        </Form>
      </Col>
    </Row>
    <div class="text-center">
      <Button class="mr100" @click="cancel">取消</Button>
      <Button type="primary" @click="save">保存</Button>
    </div>
    <Modal v-model="modalColumnsAdd" title="新增表头">
      <div class="modal-field-con">
        <Form :model="columnsObj" :label-width="120">
          <FormItem label="表头名称" class="whole-line-703">
            <AutoComplete v-model="columnsObj.title" :data="formFieldsTitle"></AutoComplete>
          </FormItem>
          <FormItem label="表头id" class="whole-line-703">
            <AutoComplete v-model="columnsObj.field" :data="formFieldsText"></AutoComplete>
          </FormItem>
          <FormItem label="formatter" class="whole-line-703">
            <Input v-model="columnsObj.formatter"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveColumnsAdd">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalColumnsEdit" title="修改表头">
      <div class="modal-field-con">
        <Form :model="columnsObj" :label-width="120">
          <FormItem label="表头名称" class="whole-line-703">
            <AutoComplete v-model="columnsObj.title" :data="formFieldsTitle"></AutoComplete>
          </FormItem>
          <FormItem label="表头id" class="whole-line-703">
            <AutoComplete v-model="columnsObj.field" :data="formFieldsText"></AutoComplete>
          </FormItem>
          <FormItem label="formatter" class="whole-line-703">
            <Input v-model="columnsObj.formatter"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveColumnsEdit">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalButtonsAdd" title="新增按钮">
      <div class="modal-field-con">
        <Form :model="buttonsObj" :label-width="120">
          <FormItem label="按钮名称" class="whole-line-703">
            <Input v-model="buttonsObj.buttonName"></Input>
          </FormItem>
          <FormItem label="按钮id" class="whole-line-703">
            <Input v-model="buttonsObj.buttonId"></Input>
          </FormItem>
          <FormItem label="图标属性" class="whole-line-703">
            <Input v-model="buttonsObj.buttonAttr"></Input>
          </FormItem>
          <FormItem label="方法名" class="whole-line-703">
            <Input v-model="buttonsObj.buttonFunction"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveButtonsAdd">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalButtonsEdit" title="修改按钮">
      <div class="modal-field-con">
        <Form :model="buttonsObj" :label-width="120">
          <FormItem label="按钮名称" class="whole-line-703">
            <Input v-model="buttonsObj.buttonName"></Input>
          </FormItem>
          <FormItem label="按钮id" class="whole-line-703">
            <Input v-model="buttonsObj.buttonId"></Input>
          </FormItem>
          <FormItem label="图标属性" class="whole-line-703">
            <Input v-model="buttonsObj.buttonAttr"></Input>
          </FormItem>
          <FormItem label="方法名" class="whole-line-703">
            <Input v-model="buttonsObj.buttonFunction"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveButtonsEdit">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalSearchsAdd" title="新增搜索栏">
      <div class="modal-field-con">
        <Form :model="searchsObj" :label-width="120">
          <FormItem label="输入名" class="whole-line-703">
            <Input v-model="searchsObj.searchName"></Input>
          </FormItem>
          <FormItem label="输入id" class="whole-line-703">
            <AutoComplete v-model="searchsObj.searchId" :data="formFieldsText"></AutoComplete>
          </FormItem>
          <FormItem label="关联字段" class="whole-line-703">
            <AutoComplete v-model="searchsObj.searchField" :data="formFieldsText"></AutoComplete>
          </FormItem>
          <FormItem label="输入属性" class="whole-line-703">
            <Input v-model="searchsObj.searchAttr"></Input>
          </FormItem>
          <FormItem label="输入类型" class="whole-line-703">
            <Select v-model="searchsObj.searchType">
              <Option v-for="item in searchInputType" :value="item.type" :key="item.type">{{item.text}}</Option>
            </Select>
          </FormItem>
          <FormItem label="搜索条件" class="whole-line-703">
            <Select v-model="searchsObj.searchCondition">
              <Option v-for="item in searchCondition" :value="item.value" :key="item.value">{{item.text}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveSearchsAdd">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalSearchsEdit" title="修改搜索栏">
      <div class="modal-field-con">
        <Form :model="searchsObj" :label-width="120">
          <FormItem label="输入名" class="whole-line-703">
            <Input v-model="searchsObj.searchName"></Input>
          </FormItem>
          <FormItem label="输入id" class="whole-line-703">
            <AutoComplete v-model="searchsObj.searchId" :data="formFieldsText"></AutoComplete>
          </FormItem>
          <FormItem label="关联字段" class="whole-line-703">
            <AutoComplete v-model="searchsObj.searchField" :data="formFieldsText"></AutoComplete>
          </FormItem>
          <FormItem label="输入属性" class="whole-line-703">
            <Input v-model="searchsObj.searchAttr"></Input>
          </FormItem>
          <FormItem label="输入类型" class="whole-line-703">
            <Select v-model="searchsObj.searchType">
              <Option v-for="item in searchInputType" :value="item.type" :key="item.type">{{item.text}}</Option>
            </Select>
            <Input v-model="searchsObj.searchType"></Input>
          </FormItem>
          <FormItem label="搜索条件" class="whole-line-703">
            <Select v-model="searchsObj.searchCondition">
              <Option v-for="item in searchCondition" :value="item.value" :key="item.value">{{item.text}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveSearchsEdit">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalSearchButtonsAdd" title="新增搜索按钮">
      <div class="modal-field-con">
        <Form :model="searchButtonsObj" :label-width="120">
          <FormItem label="按钮名称" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonName"></Input>
          </FormItem>
          <FormItem label="按钮id" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonId"></Input>
          </FormItem>
          <FormItem label="图标属性" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonAttr"></Input>
          </FormItem>
          <FormItem label="方法名" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonFunction"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveSearchButtonsAdd">保存</Button>
      </div>
    </Modal>
    <Modal v-model="modalSearchButtonsEdit" title="修改搜索按钮">
      <div class="modal-field-con">
        <Form :model="searchButtonsObj" :label-width="120">
          <FormItem label="按钮名称" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonName"></Input>
          </FormItem>
          <FormItem label="按钮id" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonId"></Input>
          </FormItem>
          <FormItem label="图标属性" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonAttr"></Input>
          </FormItem>
          <FormItem label="方法名" class="whole-line-703">
            <Input v-model="searchButtonsObj.buttonFunction"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveSearchButtonsEdit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formObj: this.$store.state.currentEditForm, // 表单对象
      formFields: [], // 表单字段
      formAttrObj: {}, // 表单配置对象
      searchInputType: this.$store.state.searchInputType, // 搜索输入框类型
      searchCondition: this.$store.state.searchCondition, // 搜索条件
      columnsColumns: [ // 表格表头表头
        {title: '表头名称', key: 'title', align: 'center'},
        {title: '表头id', key: 'field', align: 'center'},
        {title: 'formatter', key: 'formatter', align: 'center'},
        {
          title: '操作',
          key: 'action',
          width: 185,
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
                    this.columnsEdit(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.columnsDelete(params)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: params.index > 0 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.columnsUp(params)
                  }
                }
              }, '上移'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  display: params.index < this.formColumns.length - 1 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.columnsDown(params)
                  }
                }
              }, '下移')
            ])
          }
        }
      ],
      formColumns: [], // 表格表头数据
      modalColumnsAdd: false,
      modalColumnsEdit: false,
      columnsObj: {}, // 正在编辑的表格表头
      buttonsColumns: [ // 表格按钮表头
        {title: '按钮名称', key: 'buttonName', align: 'center'},
        {title: '按钮id', key: 'buttonId', align: 'center'},
        {title: '图标属性', key: 'buttonAttr', align: 'center'},
        {title: '方法名', key: 'buttonFunction', align: 'center'},
        {
          title: '操作',
          key: 'action',
          width: 185,
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
                    this.buttonsEdit(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.buttonsDelete(params)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: params.index > 0 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.buttonsUp(params)
                  }
                }
              }, '上移'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  display: params.index < this.formButtons.length - 1 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.buttonsDown(params)
                  }
                }
              }, '下移')
            ])
          }
        }
      ],
      formButtons: [], // 表格按钮数据
      modalButtonsAdd: false,
      modalButtonsEdit: false,
      buttonsObj: {}, // 正在编辑的表格按钮
      searchsColumns: [ // 表格搜索表头
        {title: '输入名', key: 'searchName', align: 'center'},
        {title: '输入id', key: 'searchId', align: 'center'},
        {title: '关联字段', key: 'searchField', align: 'center'},
        {title: '输入属性', key: 'searchAttr', align: 'center'},
        {title: '输入类型', key: 'searchType', align: 'center'},
        {title: '搜索条件', key: 'searchCondition', align: 'center'},
        {
          title: '操作',
          key: 'action',
          width: 185,
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
                    this.searchsEdit(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.searchsDelete(params)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: params.index > 0 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.searchsUp(params)
                  }
                }
              }, '上移'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  display: params.index < this.formSearchs.length - 1 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.searchsDown(params)
                  }
                }
              }, '下移')
            ])
          }
        }
      ],
      modalSearchsAdd: false,
      modalSearchsEdit: false,
      searchsObj: {}, // 正在编辑的表格搜索
      formSearchs: [], // 表格搜索数据
      searchButtonsColumns: [ // 表格搜索按钮表头
        {title: '按钮名称', key: 'buttonName', align: 'center'},
        {title: '按钮id', key: 'buttonId', align: 'center'},
        {title: '图标属性', key: 'buttonAttr', align: 'center'},
        {title: '方法名', key: 'buttonFunction', align: 'center'},
        {
          title: '操作',
          key: 'action',
          width: 185,
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
                    this.buttonSearchsEdit(params)
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.buttonSearchsDelete(params)
                  }
                }
              }, '删除'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px',
                  display: params.index > 0 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.buttonSearchsUp(params)
                  }
                }
              }, '上移'),
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  display: params.index < this.formSearchButtons.length - 1 ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.buttonSearchsDown(params)
                  }
                }
              }, '下移')
            ])
          }
        }
      ],
      formSearchButtons: [], // 表格搜索按钮数据
      modalSearchButtonsAdd: false,
      modalSearchButtonsEdit: false,
      searchButtonsObj: {}, // 正在编辑的表格搜索按钮
      jsCode: '',
      cmOptions: {
        tabSize: 2,
        mode: 'text/javascript',
        theme: 'ambiance',
        lineNumbers: true
      }
    }
  },
  methods: {
    columnsEditDone: function (newValue, oldValue, rowIndex, rowData, field) { // 表格表头编辑完
      this.formColumns[rowIndex][field] = newValue
    },
    columnsAdd: function () { // 新增表格表头
      this.columnsObj = {}
      this.modalColumnsAdd = true
    },
    saveColumnsAdd: function () { // 新增保存表格表头
      this.formColumns.push(this.columnsObj)
      this.modalColumnsAdd = false
    },
    columnsEdit: function (params) { // 修改表格表头
      this.columnsObj = params.row
      delete this.columnsObj._index
      delete this.columnsObj._rowKey
      this.modalColumnsEdit = true
    },
    saveColumnsEdit: function () { // 修改保存表格表头
      this.modalColumnsEdit = false
    },
    columnsDelete: function (params) { // 删除表格表头
      this.formColumns.splice(params.index, 1)
    },
    columnsUp: function (params) { // 表格表头上移
      if (params.index > 0) {
        let temp = this.formColumns[params.index]
        this.formColumns.splice(params.index, 1)
        this.formColumns.splice(params.index - 1, 0, temp)
      }
    },
    columnsDown: function (params) { // 表格表头下移
      if (params.index < this.formColumns.length - 1) {
        let temp = this.formColumns[params.index]
        this.formColumns.splice(params.index, 1)
        this.formColumns.splice(params.index + 1, 0, temp)
      }
    },
    buttonsAdd: function () { // 新增表格按钮
      this.buttonsObj = {}
      this.modalButtonsAdd = true
    },
    saveButtonsAdd: function () { // 新增保存表格按钮
      this.formButtons.push(this.buttonsObj)
      this.modalButtonsAdd = false
    },
    buttonsEdit: function (params) { // 修改表格按钮
      this.buttonsObj = params.row
      delete this.buttonsObj._index
      delete this.buttonsObj._rowKey
      this.modalButtonsEdit = true
    },
    saveButtonsEdit: function () { // 修改保存表格按钮
      this.modalButtonsEdit = false
    },
    buttonsDelete: function (params) { // 删除表格按钮
      this.formButtons.splice(params.index, 1)
    },
    buttonsUp: function (params) { // 表格按钮上移
      if (params.index > 0) {
        let temp = this.formButtons[params.index]
        this.formButtons.splice(params.index, 1)
        this.formButtons.splice(params.index - 1, 0, temp)
      }
    },
    buttonsDown: function (params) { // 表格按钮下移
      if (params.index < this.formButtons.length - 1) {
        let temp = this.formButtons[params.index]
        this.formButtons.splice(params.index, 1)
        this.formButtons.splice(params.index + 1, 0, temp)
      }
    },
    searchsAdd: function () { // 新增表格搜索
      this.searchsObj = {}
      this.modalSearchsAdd = true
    },
    saveSearchsAdd: function () { // 新增保存表格搜索
      this.formSearchs.push(this.searchsObj)
      this.modalSearchsAdd = false
    },
    searchsEdit: function (params) { // 修改表格搜索
      this.searchsObj = params.row
      delete this.searchsObj._index
      delete this.searchsObj._rowKey
      this.modalSearchsEdit = true
    },
    saveSearchsEdit: function () { // 修改保存表格搜索
      this.modalSearchsEdit = false
    },
    searchsDelete: function (params) { // 删除表格搜索
      this.formSearchs.splice(params.index, 1)
    },
    searchsUp: function (params) { // 表格搜索上移
      if (params.index > 0) {
        let temp = this.formSearchs[params.index]
        this.formSearchs.splice(params.index, 1)
        this.formSearchs.splice(params.index - 1, 0, temp)
      }
    },
    searchsDown: function (params) { // 表格搜索下移
      if (params.index < this.formSearchs.length - 1) {
        let temp = this.formSearchs[params.index]
        this.formSearchs.splice(params.index, 1)
        this.formSearchs.splice(params.index + 1, 0, temp)
      }
    },
    searchButtonsAdd: function () { // 新增表格搜索按钮
      this.searchButtonsObj = {}
      this.modalSearchButtonsAdd = true
    },
    saveSearchButtonsAdd: function () { // 新增保存表格搜索按钮
      this.formSearchButtons.push(this.searchButtonsObj)
      this.modalSearchButtonsAdd = false
    },
    searchButtonsEdit: function (params) { // 修改表格搜索按钮
      this.searchButtonsObj = params.row
      delete this.searchButtonsObj._index
      delete this.searchButtonsObj._rowKey
      this.modalSearchButtonsEdit = true
    },
    saveSearchButtonsEdit: function () { // 修改保存表格搜索按钮
      this.modalSearchButtonsEdit = false
    },
    searchButtonsDelete: function (params) { // 删除表格搜索按钮
      this.formSearchButtons.splice(params.index, 1)
    },
    searchButtonsUp: function (params) { // 表格搜索按钮上移
      if (params.index > 0) {
        let temp = this.formSearchButtons[params.index]
        this.formSearchButtons.splice(params.index, 1)
        this.formSearchButtons.splice(params.index - 1, 0, temp)
      }
    },
    searchButtonsDown: function (params) { // 表格搜索按钮下移
      if (params.index < this.formSearchButtons.length - 1) {
        let temp = this.formSearchButtons[params.index]
        this.formSearchButtons.splice(params.index, 1)
        this.formSearchButtons.splice(params.index + 1, 0, temp)
      }
    },
    cancel: function () {
      this.$router.go(-1)
    },
    save: function () {
      this.formAttrObj.title = this.formObj.title
      this.formAttrObj.columns = this.formColumns
      this.formAttrObj.buttons = this.formButtons
      this.formAttrObj.searchs = this.formSearchs
      this.formAttrObj.search_buttons = this.formSearchButtons
      delete this.formAttrObj.js_code
      let infoStr = JSON.stringify(this.formAttrObj)
      console.log(infoStr)
      this.$api.post('/pages/button/framework/create.do', {jsonStr: infoStr, jsCode: this.jsCode}, r => {
        if (r.data) {
          this.$Message.success('保存表单配置成功')
          this.$router.go(-1)
        } else {
          this.$Message.error('保存表单配置失败')
        }
      })
    },
    init: function () {
      this.formFields = this.formObj.field
      this.$api.post('/pages/button/framework/get.do', {title: this.formObj.title}, r => {
        console.log(r.data)
        if (r.data.obj !== null) {
          this.formAttrObj = r.data.obj
          this.initAttr(true)
        } else {
          this.initAttr(false)
        }
      })
    },
    initAttr: function (flag) {
      if (flag) { // 有数据时
        this.formColumns = JSON.parse(this.formAttrObj.columns)
        this.formButtons = JSON.parse(this.formAttrObj.buttons)
        this.formSearchs = JSON.parse(this.formAttrObj.searchs)
        this.formSearchButtons = JSON.parse(this.formAttrObj.search_buttons)
        this.jsCode = this.formAttrObj.js_code
      } else { // 无数据时加默认值
        for (let iterator of this.formFields) {
          if (iterator.text !== 'pid') {
            this.formColumns.push({
              field: iterator.text,
              title: iterator.title
            })
          }
        }
        this.formButtons = [
          {
            buttonName: '新增',
            buttonAttr: 'fa fa-plus',
            buttonId: 'add',
            buttonFunction: 'functionAdd()'
          },
          {
            buttonName: '修改',
            buttonAttr: 'fa fa-pencil',
            buttonId: 'edit',
            buttonFunction: 'functionModify()'
          },
          {
            buttonName: '查看',
            buttonAttr: 'fa fa-info-circle',
            buttonId: 'view',
            buttonFunction: 'functionView()'
          },
          {
            buttonName: '删除',
            buttonAttr: 'fa fa-trash',
            buttonId: 'delete',
            buttonFunction: 'functionDelete()'
          }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    formFieldsTitle () { // 表单字段中文名
      let arrTemp = []
      for (let iterator of this.formFields) {
        arrTemp.push(iterator.title)
      }
      return arrTemp
    },
    formFieldsText () { // 表单字段英文名
      let arrTemp = []
      for (let iterator of this.formFields) {
        arrTemp.push(iterator.text)
      }
      return arrTemp
    }
  }
}
</script>
