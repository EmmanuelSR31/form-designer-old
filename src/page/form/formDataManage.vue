<template>
<div>
  <div class="table-search-con">
    <Button type="primary" @click="addFormData">新增</Button>
    <Button type="primary" @click="setCharts">生成图表</Button>
    <Button v-for="(item, index) in buttons" type="primary" :onclick="item.buttonFunction.replace(/&acute;/g, '\'')" :key="index">{{item.buttonName}}</Button>
    <span class="pull-right">
      <template v-for="(item, index) in searchs">
        <template v-if="item.searchCondition === 'isEmpty'">
          <Select v-model="searchObj[item.searchId]" :key="index">
            <Option value="is null">为空</Option>
            <Option value="is not null">不为空</Option>
          </Select>
        </template>
        <template v-else-if="item.searchType === 'textbox'">
          <Input v-model="searchObj[item.searchId]" style="width:100px;" :key="index"></Input>
        </template>
        <template v-else-if="item.searchType === 'combobox'">
          <Select v-model="searchObj[item.searchId]" :key="index">
            <Option v-for="tmp in selectData[item.searchField]" :value="tmp.id" :key="tmp.id">{{tmp.text}}</Option>
          </Select>
        </template>
        <template v-else-if="item.searchType === 'datebox'">
          <DatePicker type="date" v-model="searchObj[item.searchId]" style="width:100px" :key="index"></DatePicker>
        </template>
        <template v-else-if="item.searchType === 'monthbox'">
          <DatePicker type="month" v-model="searchObj[item.searchId]" style="width:100px" :key="index"></DatePicker>
        </template>
      </template>
      <Button v-for="(item, index) in searchButtons" type="primary" :onclick="item.buttonFunction.replace(/&acute;/g, '\'')" :key="index">{{item.buttonName}}</Button>
    </span>
  </div>
  <Row>
    <Col v-if="formObj.needTree === 'true'" :span="formObj.needTree === 'true' ? 8 : 0">
      <!-- <Tree :data="treeData" @on-select-change="setPid" ref="treeTable"></Tree> -->
      <tree-grid :items="treeData" :columns="treeColumns" @on-row-click="rowClick"></tree-grid>
    </Col>
    <Col :span="formObj.needTree === 'true' ? 16 : 24">
      <Table :height="tableHeight" border :loading="loading" :columns="columns" :data="data" stripe highlight-row @on-current-change="setCurrentData"></Table>
      <div class="page-con">
        <Page :total="totalRows" :current="currentPage" :page-size="pageSize" placement="top" @on-change="changePage" @on-page-size-change="changePageSize" show-elevator show-sizer></Page>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
import TreeGrid from '../components/treeGrid2.0.vue'
import processDetail from '../components/processDetail.vue'
export default {
  components: {
    TreeGrid, // 树插件
    processDetail // 流程详情组件
  },
  data () {
    return {
      tableName: this.$route.params.tableName, // 表单名
      formObj: {}, // 表单对象
      loading: false, // 加载中
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示数
      totalRows: 0, // 数据总数
      columns: [], // 表格表头
      data: [], // 数据
      currentData: {}, // 选中数据
      selectData: this.$store.state.selectData, // 下拉数据
      treeColumns: [], // 树形表表头
      treeData: [], // 树形表数据
      pid: '', // 父ID
      isAct: 1, // 是否有流程，0为有，1为无
      formAttrObj: {}, // 表单配置对象
      buttons: [], // 表单配置按钮
      searchs: [], // 表单配置搜索栏
      searchButtons: [], // 表单配置搜索按钮
      searchObj: {} // 表单搜索对象
    }
  },
  computed: {
    tableHeight: function () { // 表格高度
      return document.body.clientHeight - 210
    }
  },
  methods: {
    /**
    * @desc 改变页码
    * @param {Num} current 页码
    */
    changePage: function (current) {
      this.loading = true
      this.currentPage = current
      if (this.formObj.needTree === 'true' && this.formObj.treeForm !== '') {
        this.$api.post('/crm/ActionFormUtil/getByTableNameAndPid.do', {rows: this.pageSize, page: this.currentPage, tableName: this.tableName, pid: this.pid}, r => {
          this.totalRows = r.data.total
          this.data = r.data.rows
          this.loading = false
        })
      } else {
        this.$api.post('/crm/ActionFormUtil/getByTableName.do', {rows: this.pageSize, page: this.currentPage, tableName: this.tableName}, r => {
          this.totalRows = r.data.total
          this.data = r.data.rows
          console.log(this.columns)
          this.loading = false
        })
      }
    },
    /**
    * @desc 改变每页显示数
    * @param {Num} size 每页显示数
    */
    changePageSize: function (size) {
      this.pageSize = size
      this.changePage(this.currentPage)
    },
    /**
    * @desc 选中数据
    * @param {Object} currentRow 选中的数据
    */
    setCurrentData: function (currentRow, oldCurrentRow) {
      this.currentData = currentRow
    },
    /**
    * @desc 新增数据
    */
    addFormData: function () {
      Util.addFormData(this.tableName, this.formObj, this.pid, this.aaa)
    },
    /**
    * @desc 树点击一行
    * @param {Object} data 点击的数据
    */
    rowClick: function (data, index, event) {
      this.pid = data.id
      this.currentPage = 1
      this.changePage(this.currentPage)
    },
    /* setPid: function (row) { // 点击数据设置父ID
      this.pid = row[0].id
      this.currentPage = 1
      this.changePage(this.currentPage)
    }, */
    /**
    * @desc 初始化
    */
    init: function () {
      this.data = []
      this.columns = []
      // this.initApi()
      this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.tableName}, r => {
        this.formObj = r.data
        Util.initFormQuoteSelectData(this.formObj.field)
        this.$api.post('/profFormRel/isAct', {tableName: this.tableName}, r => {
          this.isAct = r.data
          this.$api.post('/pages/button/framework/get.do', {title: this.tableName}, r => {
            if (r.data.obj !== null) {
              this.formAttrObj = r.data.obj
              console.log(this.formAttrObj)
              this.columns = this.columns.concat([{type: 'index', title: '序列', width: 50, align: 'center'}], Util.columnsFormatter(JSON.parse(this.formAttrObj.columns)))
              this.buttons = JSON.parse(this.formAttrObj.buttons)
              this.searchs = JSON.parse(this.formAttrObj.searchs)
              this.searchButtons = JSON.parse(this.formAttrObj.search_buttons)
              eval(this.formAttrObj.js_code.replace(/&quot;/g, '"').replace(/换行符/g, '\n').replace(/&acute;/g, '\''))
            } else {
              this.columns = Util.initColumns(this.formObj.field, true)
            }
            this.columns = Util.columnsAddAction(this.columns, this.tableName, this.formObj, this.changePage, this.currentPage)
            if (this.isAct === 0) {
              this.columns = Util.columnsAddProcess(this.columns, this.viewProcessDetail)
            }
            if (this.formObj.needTree === 'true' && this.formObj.treeForm !== '') {
              this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.formObj.treeForm}, r => {
                let treeField = r.data.treeField
                this.treeColumns = Util.initColumns(r.data.field, false)
                this.$api.post('/crm/ActionFormUtil/getByTableName.do', {rows: this.pageSize, page: this.currentPage, tableName: this.formObj.treeForm}, r => {
                  this.treeData = Util.dataConvertForTree(r.data, treeField)
                })
              })
            } else {
              this.changePage(this.currentPage)
            }
          })
        })
      })
    },
    /**
    * @desc 初始化
    */
    initApi: async function () {
      this.formObj = await this.getFormJson()
      this.isAct = await this.getAct()
      let frameworkObj = await this.getFramework()
      if (frameworkObj !== null) {
        this.formAttrObj = frameworkObj
        console.log(this.formAttrObj)
        this.columns = this.columns.concat([{type: 'index', title: '序列', width: 50, align: 'center'}], Util.columnsFormatter(JSON.parse(this.formAttrObj.columns)))
        this.buttons = JSON.parse(this.formAttrObj.buttons)
        this.searchs = JSON.parse(this.formAttrObj.searchs)
        this.searchButtons = JSON.parse(this.formAttrObj.search_buttons)
        eval(this.formAttrObj.js_code.replace(/&quot;/g, '"').replace(/换行符/g, '\n').replace(/&acute;/g, '\''))
      } else {
        this.columns = Util.initColumns(this.formObj.field, true)
      }
      this.columns = Util.columnsAddAction(this.columns, this.tableName, this.formObj, this.changePage, this.currentPage)
      if (this.isAct === 0) {
        this.columns = Util.columnsAddProcess(this.columns, this.viewProcessDetail)
      }
      if (this.formObj.needTree === 'true' && this.formObj.treeForm !== '') {
        this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.formObj.treeForm}, r => {
          let treeField = r.data.treeField
          this.treeColumns = Util.initColumns(r.data.field, false)
          this.$api.post('/crm/ActionFormUtil/getByTableName.do', {rows: this.pageSize, page: this.currentPage, tableName: this.formObj.treeForm}, r => {
            this.treeData = Util.dataConvertForTree(r.data, treeField)
          })
        })
      } else {
        this.changePage(this.currentPage)
      }
    },
    /**
    * @desc 取表单json
    */
    getFormJson: async function () {
      return new Promise((resolve) => {
        this.$api.post('/pages/crminterface/getDatagridForJson.do', {tableName: this.tableName}, r => {
          resolve(r.data)
        })
      })
    },
    /**
    * @desc 取表单是否有流程
    */
    getAct: async function () {
      return new Promise((resolve) => {
        this.$api.post('/profFormRel/isAct', {tableName: this.tableName}, r => {
          resolve(r.data)
        })
      })
    },
    /**
    * @desc 取表单配置
    */
    getFramework: async function () {
      return new Promise((resolve) => {
        this.$api.post('/pages/button/framework/get.do', {title: this.tableName}, r => {
          resolve(r.data.obj)
        })
      })
    },
    /**
    * @desc 查看流程详情
    * @param {Object} params 数据对象
    */
    viewProcessDetail: function (params) {
      this.$layer.iframe({
        content: {
          content: processDetail, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            uuid: params.row.uuid
          }
        },
        area: ['600px', document.body.clientHeight - 20 + 'px'],
        title: '查看流程详情',
        shade: true,
        shadeClose: false
      })
    },
    setCharts: function () { // 生成图表
      this.$router.push({
        name: 'formChart',
        params: {tableName: this.tableName}
      })
    },
    search1: function () {
      let temp = ''
      for (let iterator of this.searchs) {
        if (!Util.isEmpty(this.searchObj[iterator.searchId])) {
          temp += ' and ' + iterator.searchField
          if (iterator.searchCondition === 'equal') {
            temp += ' =\' ' + this.searchObj[iterator.searchId] + '\''
          } else if (iterator.searchCondition === 'notEqual') {
            temp += ' <>\' ' + this.searchObj[iterator.searchId] + '\''
          } else if (iterator.searchCondition === 'contains') {
            temp += ' like \'' + this.searchObj[iterator.searchId] + '\''
          } else if (iterator.searchCondition === 'notContains') {
            temp += ' not like \'' + this.searchObj[iterator.searchId] + '\''
          } else if (iterator.searchCondition === 'isEmpty') {
            temp += ' ' + this.searchObj[iterator.searchId] + ' '
          } else if (iterator.searchCondition === 'greater') {
            temp += ' > \'' + this.searchObj[iterator.searchId] + '\''
          } else if (iterator.searchCondition === 'less') {
            temp += ' < \'' + this.searchObj[iterator.searchId] + '\''
          }
        }
      }
      return temp
    }
  },
  mounted () {
    // this.init()
    this.initApi()
  },
  watch: {
    '$route' (to, from) { // 强制初始化
      this.tableName = to.params.tableName
      this.initApi()
    }
  }
}
</script>
