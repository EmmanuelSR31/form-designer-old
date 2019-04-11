import store from '@/store'
import api from '@/api/index.js'
import {router} from '@/router/index'
import iView from 'iview'
import uuidv4 from 'uuid/v4'

let util = {}

/**
* @desc 两数组是否相等
* @param {Array} arr 数组一
* @param {Array} targetArr 数组二
* @return {Boolean} res 是否相等，是返回true，否返回false
*/
util.inOf = function (arr, targetArr) {
  let res = true
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

/**
* @desc 数组是否包含
* @param {Object} ele 对象
* @param {Array} targetArr 数组
* @return {Boolean} 是否包含，是返回true，否返回false
*/
util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

/**
* @desc 是否为空
* @param {Object} obj 对象
* @return {Boolean} 是否为空，是返回true，否返回false
*/
util.isEmpty = function (obj) {
  if (obj === null) return true
  if (typeof obj === 'undefined') {
    return true
  }
  if (typeof obj === 'string') {
    if (obj === '') {
      return true
    }
    var reg = new RegExp('^([ ]+)|([　]+)$')
    return reg.test(obj)
  }
  return false
}

/**
* @desc 复制数组
* @param {Array} arr 数组
* @return {Array} 数组
*/
util.copyArr = function (arr) {
  return arr.map((e) => {
    if (typeof e === 'object') {
      return Object.assign({}, e)
    } else {
      return e
    }
  })
}

/**
* @desc 删除最后的逗号
* @param {String} str 字符串
* @return {String} 字符串
*/
util.removeLastComma = function (str) {
  return str.lastIndexOf(',') === (str.length - 1) ? str.substring(0, str.length - 1) : str
}

/**
* @desc 去除前后空格
* @param {String} str 字符串
* @return {String} 字符串
*/
util.myTrim = function (str) {
  return str.replace(/^\s+|\s+$/gm, '')
}

/**
* @desc 字符串转为整数
* @param {String} str 字符串
* @return {Num} 整数
*/
util.strToInt = function (str) {
  return parseInt(str)
}

/**
* @desc 百分数转小数
* @param {String} str 字符串
* @return {Num} 数字
*/
util.changePercentToPoint = function (str) {
  if (str.toString().indexOf('%') !== -1) {
    str = str.toString().replace('%', '')
    str = str / 100
  }
  return str
}

/**
* @desc 字段数组加数据类型
* @param {Array} fields 字段数组
* @return {Array} 字段数组
*/
util.fieldsAddType = function (fields) {
  for (var field of fields) {
    if (field.fieldType === 'numberbox') {
      field.type = field.precision === '0' ? 'int' : 'float'
    } else if (field.fieldType === 'datebox') {
      field.type = 'date'
    } else if (field.fieldType === 'datetimebox') {
      field.type = 'datetime'
    } else {
      field.type = 'varchar(255)'
    }
    if (field.fieldType === 'tablebox') {
      field.listDisplay = true
    }
  }
  return fields
}

/**
* @desc 保存数据格式化
* @param {Array} fields 字段数组
* @return {Array} data 字段保存数据数组
*/
util.getFormValues = function (fields) {
  let data = []
  for (let variable in fields) {
    data.push({
      text: variable,
      value: '\'' + fields[variable] + '\''
    })
  }
  return data
}

/**
* @desc 去除不展示字段
* @param {Array} fields 字段数组
* @return {Array} arr 字段数组
*/
util.removeFieldTable = function (fields) {
  let arr = []
  for (let variable of fields) {
    if (!['create_user_id', 'taskid', 'pid'].includes(variable.text)) {
      arr.push(variable)
    }
  }
  return arr
}

/**
* @desc 绑定字段数据默认值
* @param {Array} fields 字段数组
* @return {Object} obj 数据对象
*/
util.fieldArrToObj = function (fields) {
  let obj = {}
  for (let field of fields) {
    obj[field.text] = field.fieldType === 'numberbox' ? 0 : field.fieldType === 'checkbox' ? [] : ''
    if (['datebox', 'datetimebox', 'monthbox', 'yearbox'].includes(field.fieldType)) {
      if (field.currentDate === 'true') {
        obj[field.text] = this.getCurrentDate()
      }
    }
  }
  return obj
}

/**
* @desc 处理表单数据
* @param {Array} fields 字段数组
* @param {Object} dataObj 数据对象
* @return {Object} dataObj 数据对象
*/
util.formatFormData = function (fields, dataObj) {
  delete dataObj.id
  delete dataObj.create_user_id
  delete dataObj.taskid
  delete dataObj._index
  delete dataObj._rowKey
  for (let field of fields) {
    if (field.fieldType === 'checkbox') {
      dataObj[field.text] = this.isEmpty(dataObj[field.text]) ? [] : dataObj[field.text].split(',')
    } else if (field.fieldType === 'numberbox') {
      dataObj[field.text] = Number(dataObj[field.text])
    } else if (field.fieldType === 'switch') {
      if (dataObj[field.text] === 'true') {
        dataObj[field.text] = true
      } else if (dataObj[field.text] === 'false') {
        dataObj[field.text] = false
      }
    }
  }
  return dataObj
}

/**
* @desc 处理附件字段的数据
* @param {Array} fields 字段数组
* @param {Object} dataObj 数据对象
* @return {Object} obj 附件字段数据对象
*/
util.formatFieldFile = function (fields, dataObj) {
  let obj = {}
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].fieldType === 'filebox') {
      let paths = dataObj[fields[i].text]
      obj[fields[i].text] = this.isEmpty(paths) ? [] : paths.split(',')
    }
  }
  return obj
}

/**
* @desc 格式化树数据
* @param {Array} data 数据列表
* @return {Array} data 数据列表
*/
util.formatterTreeData = function (data) {
  for (let variable of data) {
    variable.title = variable.text
    variable.expand = true
    if (variable.children.length > 0) {
      for (let temp of variable.children) {
        temp.title = temp.text
        if (temp.children.length > 0) {
          for (let tmp of temp.children) {
            tmp.title = tmp.text
            if (tmp.children.length > 0) {
              for (let tp of tmp.children) {
                tp.title = tp.text
              }
            }
          }
        }
      }
    }
  }
  return data
}

/**
* @desc 格式化拖拽树数据
* @param {Array} data 数据列表
* @return {Array} data 数据列表
*/
util.formatterDragTreeData = function (data) {
  for (let variable of data) {
    variable.title = variable.text
    variable.expand = true
    if (variable.children.length > 0) {
      for (let temp of variable.children) {
        temp.title = temp.text
        if (temp.children.length > 0) {
          for (let tmp of temp.children) {
            tmp.title = tmp.text
            if (tmp.children.length > 0) {
              for (let tp of tmp.children) {
                tp.title = tp.text
              }
            } else {
              tmp.isLeaf = true
            }
          }
        } else {
          temp.isLeaf = true
        }
      }
    } else {
      variable.isLeaf = true
    }
  }
  return data
}

/**
* @desc 数据转换为树结构数据格式
* @param {Object} tableData 数据对象
* @return {Array} arr 树结构数据列表
*/
util.dataConvertForTree = function (tableData, treeField) {
  let datas = tableData.rows
  let arr = []
  /* for (let iterator of datas) {
    iterator.title = iterator[treeField]
  } */
  for (let i = 0; i < datas.length; i++) {
    datas[i].pid = parseInt(datas[i].pid)
    if (datas[i].pid === 0) {
      datas[i].children = []
      for (let j = 0; j < datas.length; j++) {
        datas[j].children = []
        for (let z = 0; z < datas.length; z++) {
          if (datas[z].pid === datas[j].id) {
            datas[j].children.push(datas[z])
          }
        }
        if (datas[j].pid === datas[i].id) {
          datas[i].children.push(datas[j])
        }
      }
      arr.push(datas[i])
    }
  }
  return arr
}

/**
* @desc 表头属性修改
* @param {Array} columns 表头
* @return {Array} columns 表头
*/
util.columnsFormatter = function (columns) {
  for (let iterator of columns) {
    iterator.key = iterator.field
    delete iterator.field
  }
  return columns
}

/**
* @desc 获取当前日期
* @return {Date} 当前日期
*/
util.getCurrentDate = function () {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = date.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let hour = date.getHours()
  let minutes = date.getMinutes()
  let second = date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second
  // return date.toLocaleString('zh', {hour12: false})
}

/**
* @desc 生成uuid
* @return {String} uuid
*/
util.uuid = function () {
  /* function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()) */
  return uuidv4()
}

/**
* @desc 字段去除属性禁用
* @param {Array} fields 字段列表
* @return {Array} arr 字段列表
*/
util.fieldsForSelect = function (fields) {
  let arr = fields.concat()
  for (let iterator of arr) {
    delete iterator.disabled
    delete iterator.readonly
  }
  return arr
}

/**
* @desc 浮点数加法运算
*/
util.FloatAdd = function (arg1, arg2) {
  let r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

/**
* @desc 浮点数减法运算
*/
util.FloatSub = function (arg1, arg2) {
  let r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  n = (r1 = r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/**
* @desc 浮点数乘法运算
*/
util.FloatMul = function (arg1, arg2) {
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) {}
  try { m += s2.split('.')[1].length } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
* @desc 浮点数除法运算
*/
util.FloatDiv = function (arg1, arg2) {
  let t1 = 0
  let t2 = 0
  let r1, r2
  try { t1 = arg1.toString().split('.')[1].length } catch (e) {}
  try { t2 = arg2.toString().split('.')[1].length } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
* @desc string转为Boolean
* @param {String} str 字符串
* @return {Boolean} 布尔值
*/
util.strToBool = function (str) { // string转为Boolean
  if (str === 'true') {
    return true
  } else if (str === 'false') {
    return false
  }
}

/**
* @desc 新增数据
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {String} pid 父ID
*/
util.addFormData = function (tableName, formObj, pid) {
  store.dispatch('setCurrentEditForm', formObj)
  if (formObj.needTree === 'true' && formObj.treeForm !== '') {
    if (pid === '') {
      iView.Message.error('请先选择左侧一条数据')
      return false
    }
  }
  router.push({
    name: 'editFormData',
    params: {tableName: tableName, id: '', pid: pid, method: 'add'}
  })
}

/**
* @desc 修改数据
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {Object} params 修改的数据对象
*/
util.editFormData = function (tableName, formObj, params) {
  store.dispatch('setCurrentEditForm', formObj)
  store.dispatch('setCurrentEditFormData', params.row)
  router.push({
    name: 'editFormData',
    params: {tableName: tableName, id: params.row.id, pid: '', method: 'edit'}
  })
}

/**
* @desc 查看数据
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {Object} params 修改的数据对象
*/
util.viewFormData = function (tableName, formObj, params) {
  store.dispatch('setCurrentEditForm', formObj)
  store.dispatch('setCurrentEditFormData', params.row)
  router.push({
    name: 'editFormData',
    params: {tableName: tableName, id: params.row.id, pid: '', method: 'view'}
  })
}

/**
* @desc 删除数据
* @param {String} tableName 表单名
* @param {Object} params 修改的数据对象
* @param {Function} changePage 翻页方法
* @param {Int} currentPage 当前页
*/
util.deleteFormData = function (tableName, params, changePage, currentPage) {
  iView.Modal.confirm({
    title: '',
    content: '确认删除此数据？',
    onOk: () => {
      api.post('/crm/ActionFormUtil/delete.do', {tableName: tableName, id: params.row.id}, r => {
        if (r.data === '0') {
          iView.Message.error('删除数据失败')
        } else {
          iView.Message.success('删除数据成功')
          changePage(currentPage)
        }
      })
    },
    onCancel: () => {
    }
  })
}

/**
* @desc 生成表格表头
* @param {Array} fields 表单字段
* @param {Boolean} flag 是否需要序列表头
* @return {Object} column 表头
*/
util.initColumns = function (fields, flag) {
  let columnsTemp = []
  if (flag) {
    columnsTemp.push({
      type: 'index',
      title: '序列',
      width: 50,
      align: 'center'
    })
  }
  for (let variable of fields) {
    if (variable.listDisplay === 'true' || variable.listDisplay === true) {
      if (variable.fieldType === 'tablebox') {
        columnsTemp.push(this.tableboxColumns(variable))
      } else if (variable.fieldType === 'combobox') {
        columnsTemp.push(this.comboboxColumns(variable))
      } else if (variable.fieldType === 'filebox') {
        columnsTemp.push(this.fileColumns(variable))
      } else {
        columnsTemp.push(this.textColumns(variable))
      }
    }
  }
  console.log(columnsTemp)
  return columnsTemp
}

/**
* @desc 生成子表表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.tableboxColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    width: 80,
    align: 'center',
    render: (h, params) => {
      return h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        on: {
          click: () => {
            this.childTableManage(params, variable.tableTitle)
          }
        }
      }, '查看详情')
    }
  }
  return column
}

/**
* @desc 管理子表数据
* @param {Object} params 数据对象
* @param {String} tableTitle 子表表名
*/
util.childTableManage = function (params, tableTitle) {
  router.push({
    name: 'childTableManage',
    params: {tableName: tableTitle, recordID: params.row.uuid}
  })
}

/**
* @desc 生成下拉表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.comboboxColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    render: (h, params) => {
      let fieldText = params.column.key
      let selectId = variable.selectID
      let valueTemp = ''
      if (!this.isEmpty(params.row[fieldText]) && !this.isEmpty(store.state.selectData[selectId])) {
        let valueTemp1 = store.state.selectData[selectId].find((element) => (element.id.toString() === params.row[fieldText]))
        if (!this.isEmpty(valueTemp1)) {
          valueTemp = valueTemp1.text
        }
      }
      return h('div', valueTemp)
    }
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 生成附件表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.fileColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    render: (h, params) => {
      let temp = params.row[variable.text]
      let files = temp.split(',')
      return h('div', files.map(function (item) {
        if (item !== '') {
          return h('a', {
            attrs: {
              href: item,
              download: item.split('/')[3].substring(36),
              target: '_blank'
            }
          }, item.split('/')[3].substring(36) + ',')
        }
      }))
    }
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 生成文本表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.textColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 增加表头属性
* @param {Object} column 表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.columnProps = function (column, variable) {
  if (variable.trWidth !== 0 && variable.trWidth !== undefined) {
    column.width = variable.trWidth
  }
  if (variable.trAlign !== undefined) {
    column.align = variable.trAlign
  }
  return column
}

/**
* @desc 表头加操作列
* @param {Array} columnsTemp 表头
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {Function} changePage 翻页方法
* @param {Int} currentPage 当前页
*/
util.columnsAddAction = function (columnsTemp, tableName, formObj, changePage, currentPage) {
  columnsTemp.push({
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    render: (h, params) => {
      return h('div', [
        h('Button', {
          props: {
            type: 'success',
            size: 'small'
          },
          style: {
            marginRight: '5px'
          },
          on: {
            click: () => {
              this.viewFormData(tableName, formObj, params)
            }
          }
        }, '查看'),
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
              this.editFormData(tableName, formObj, params)
            }
          }
        }, '修改'),
        h('Button', {
          props: {
            type: 'error',
            size: 'small'
          },
          on: {
            click: () => {
              this.deleteFormData(tableName, params, changePage, currentPage)
            }
          }
        }, '删除')
      ])
    }
  })
  return columnsTemp
}

/**
* @desc 表头加流程列
* @param {Array} columnsTemp 表头数组
* @param {Function} viewProcessDetail 查看流程详情方法
*/
util.columnsAddProcess = function (columnsTemp, viewProcessDetail) {
  columnsTemp.push({
    title: '流程进度',
    key: 'msg',
    width: 80,
    align: 'center'
  })
  columnsTemp.push({
    title: '流程详情',
    key: 'process',
    width: 80,
    align: 'center',
    render: (h, params) => {
      return h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        on: {
          click: () => {
            viewProcessDetail(params)
          }
        }
      }, '流程详情')
    }
  })
  return columnsTemp
}

/**
* @desc 设置Cookie
* @param {String} name 名字
* @param {String} value 值
*/
util.setCookie = function (name, value) {
  let Days = 7
  let exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

/**
* @desc 取Cookie
* @param {String} name 名字
*/
util.getCookie = function (name) {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
* @desc 删除Cookie
* @param {String} name 名字
*/
util.delCookie = function (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = this.getCookie(name)
  if (cval !== null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

/**
* @desc 流程状态格式化
* @param {String} value 状态值
* @return {String} 状态文本
*/
util.flowStateFormat = function (value) {
  let temp = {Ready: '可领取', Completed: '已完成', Forwarded: '已跳转', Created: '已创建', Reserved: '预分配', Withdraw: '退回'}
  return temp[value]
}

/**
* @desc 链接输入参数条件格式化
* @param {String} value 条件值
* @return {String} 条件文本
*/
util.urlInParaTypeFormat = function (value) {
  return this.isEmpty(value) ? '' : store.state.urlInParaCondition.find((element) => (element.value === value)).text
}

/**
* @desc 是否格式化
* @param {String} value 值
* @return {String} 文本
*/
util.trueFalseFormat = function (value) {
  return value || value === 'true' ? '是' : '否'
}

/**
* @desc 引用下拉输入参数值格式化
* @param {String} value 参数值
* @return {String} 参数名
*/
util.urlInParaOptionFormat = function (value) {
  return this.isEmpty(value) ? '' : store.state.urlInParaOption.find((element) => (element.value === value)).text
}

/**
* @desc 初始化表单引用下拉数据
* @param {Array} fields 字段列表
*/
util.initFormQuoteSelectData = function (fields) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].fieldType === 'combobox' && fields[i].selectType === '1') {
      let obj = {}
      obj.name = fields[i].selectID
      // 下拉输入字段
      if (!this.isEmpty(fields[i].inParas) && fields[i].inParas.length > 0) {
        for (let j = 0; j < fields[i].inParas.length; j++) {
          if (fields[i].inParas[j].option === 'userId') {
            obj[fields[i].inParas[j].name] = store.state.user.id
          } else if (fields[i].inParas[j].option === 'write') {
            obj[fields[i].inParas[j].name] = fields[i].inParas[j].value
          }
        }
      }
      api.post('/develop/url/getUrl.do', obj, r => {
        store.state.selectData[fields[i].selectID] = r.data
        console.log('链接下拉')
        console.log(store.state.selectData)
      })
    }
  }
}

/**
* @desc 初始化级联字段下拉数据
* @param {Object} field 级联字段
* @param {Array} fields 字段列表
* @param {String} val 字段值
*/
util.changeCascadeSelectData = function (field, fields, val) {
  let toField = fields.find(ele => ele.text === field.cascadeField)
  api.post('/develop/url/getUrl.do', {name: toField.selectID, value: val}, r => {
    store.state.selectData[toField.selectID] = r.data
    console.log('级联下拉')
    console.log(store.state.selectData)
  })
}

/**
* @desc 数字字段值计算
* @param {Object} field 数字字段
* @param {Object} formDataObj 数据对象
* @return {Number} 计算值
*/
util.numberCalculate = function (field, formDataObj) {
  let count = 0
  if (field.calculateType === 'multiply' || field.calculateType === 'plus') {
    for (let i = 0; i < field.calculateFields.length; i++) {
      let temp = field.calculateFields[i]
      if (i === 0) {
        count = formDataObj[temp]
      } else {
        if (field.calculateType === 'multiply') {
          count = this.FloatMul(this.changePercentToPoint(count), this.changePercentToPoint(formDataObj[temp]))
        } else if (field.calculateType === 'plus') {
          count = this.FloatAdd(this.changePercentToPoint(count), this.changePercentToPoint(formDataObj[temp]))
        }
      }
    }
  } else if (field.calculateType === 'divide') {
    count = this.FloatDiv(this.changePercentToPoint(formDataObj[field.calculateFirstField]), this.changePercentToPoint(formDataObj[field.calculateLastField]))
  } else if (field.calculateType === 'minus') {
    count = this.FloatSub(this.changePercentToPoint(formDataObj[field.calculateFirstField]), this.changePercentToPoint(formDataObj[field.calculateLastField]))
  }
  return count
}

/**
* @desc 初始化图表配置
* @param {Object} chartObj 图表配置对象
* @param {Array} xField 维度字段列表
* @param {Array} yField 数值字段列表
* @param {String} yFieldType 数值字段图表类型
* @param {Array} secondaryYField 次轴字段列表
* @param {String} secondaryYFieldType 次轴字段图表类型
* @param {Array} colorTheme 配色
* @param {Array} radarMax 雷达图最大值
* @param {Array} xData 维度数据
* @param {Array} yData 数值数据
* @param {Array} sYData 次轴数据
* @return {Object} obj 图表配置对象
*/
util.initChartOption = function (chartObj, xField, yField, yFieldType, scatterYField, secondaryYField, secondaryYFieldType, colorTheme, radarMax, xData, yData, sYData) {
  let obj = {}
  let xName = ''
  let yName = ''
  let type = chartObj.type
  let waterfallData = Array.of(0)
  if (['stack-bar', 'waterfall', 'transverse-bar', 'stack-transverse-bar'].indexOf(type) !== -1) {
    type = 'bar'
  }
  if (['area-line', 'stack-area-line'].indexOf(type) !== -1) {
    type = 'line'
  }
  if (['line-and-bar'].indexOf(type) !== -1) {
    type = yFieldType === 'stack-bar' ? 'bar' : yFieldType
  }
  xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  yData = [[820, 932, 901, 934, 1290, 1330, 1320], [420, 952, 501, 634, 1090, 1630, 1520]]
  sYData = [[420, 932, 901, 534, 1290, 1330, 1120], [420, 452, 601, 634, 690, 1230, 1120]]
  let scatterData = [
    [
      [10.0, 8.04],
      [8.0, 6.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84],
      [7.0, 4.82],
      [5.0, 5.68]
    ],
    [
      [18.0, 9.96],
      [2.0, 7.28],
      [8.0, 8.22],
      [12.0, 10.88],
      [7.0, 8.82],
      [5.0, 5.28],
      [10.0, 8.08],
      [8.0, 2.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33]
    ]
  ]
  let treemapData = [
    {
      name: 'nodeA',
      value: 10,
      children: [{
        name: 'nodeAa',
        value: 4
      }, {
        name: 'nodeAb',
        value: 6
      }]
    }, {
      name: 'nodeB',
      value: 20,
      children: [{
        name: 'nodeBa',
        value: 20,
        children: [{
          name: 'nodeBa1',
          value: 20
        }]
      }]
    }
  ]
  let sunburstData = [
    {
      name: 'Grandpa',
      children: [{
        name: 'Uncle Leo',
        value: 15,
        children: [{
          name: 'Cousin Jack',
          value: 2
        }, {
          name: 'Cousin Mary',
          value: 5,
          children: [{
            name: 'Jackson',
            value: 2
          }]
        }, {
          name: 'Cousin Ben',
          value: 4
        }]
      }, {
        name: 'Father',
        value: 10,
        children: [{
          name: 'Me',
          value: 5
        }, {
          name: 'Brother Peter',
          value: 1
        }]
      }]
    },
    {
      name: 'Nancy',
      children: [{
        name: 'Uncle Nike',
        children: [{
          name: 'Cousin Betty',
          value: 1
        }, {
          name: 'Cousin Jenny',
          value: 2
        }]
      }]
    }
  ]
  let sankeyData = [{
    name: 'a'
  }, {
    name: 'b'
  }, {
    name: 'a1'
  }, {
    name: 'a2'
  }, {
    name: 'b1'
  }, {
    name: 'c'
  }]
  let sankeyLink = [{
    source: 'a',
    target: 'a1',
    value: 5
  }, {
    source: 'a',
    target: 'a2',
    value: 3
  }, {
    source: 'b',
    target: 'b1',
    value: 8
  }, {
    source: 'a',
    target: 'b1',
    value: 3
  }, {
    source: 'b1',
    target: 'a1',
    value: 1
  }, {
    source: 'b1',
    target: 'c',
    value: 2
  }]
  let kData = [
    [20, 30, 10, 35],
    [40, 35, 30, 55],
    [33, 38, 33, 40],
    [40, 40, 32, 42]
  ]
  var mapData = [
    {name: '海门', value: 9},
    {name: '鄂尔多斯', value: 12},
    {name: '招远', value: 12},
    {name: '舟山', value: 12},
    {name: '齐齐哈尔', value: 14},
    {name: '盐城', value: 15},
    {name: '赤峰', value: 16},
    {name: '青岛', value: 18},
    {name: '乳山', value: 18},
    {name: '金昌', value: 19},
    {name: '泉州', value: 21},
    {name: '莱西', value: 21},
    {name: '日照', value: 21},
    {name: '胶南', value: 22},
    {name: '南通', value: 23},
    {name: '拉萨', value: 24},
    {name: '云浮', value: 24},
    {name: '梅州', value: 25},
    {name: '文登', value: 25},
    {name: '上海', value: 25},
    {name: '攀枝花', value: 25},
    {name: '威海', value: 25},
    {name: '承德', value: 25},
    {name: '厦门', value: 26},
    {name: '汕尾', value: 26},
    {name: '潮州', value: 26},
    {name: '丹东', value: 27},
    {name: '太仓', value: 27},
    {name: '曲靖', value: 27},
    {name: '烟台', value: 28},
    {name: '福州', value: 29},
    {name: '瓦房店', value: 30},
    {name: '即墨', value: 30},
    {name: '抚顺', value: 31},
    {name: '玉溪', value: 31},
    {name: '张家口', value: 31},
    {name: '阳泉', value: 31},
    {name: '莱州', value: 32},
    {name: '湖州', value: 32},
    {name: '汕头', value: 32},
    {name: '昆山', value: 33},
    {name: '宁波', value: 33},
    {name: '湛江', value: 33},
    {name: '揭阳', value: 34},
    {name: '荣成', value: 34},
    {name: '连云港', value: 35},
    {name: '葫芦岛', value: 35},
    {name: '常熟', value: 36},
    {name: '东莞', value: 36},
    {name: '河源', value: 36},
    {name: '淮安', value: 36},
    {name: '泰州', value: 36},
    {name: '南宁', value: 37},
    {name: '营口', value: 37},
    {name: '惠州', value: 37},
    {name: '江阴', value: 37},
    {name: '蓬莱', value: 37},
    {name: '韶关', value: 38},
    {name: '嘉峪关', value: 38},
    {name: '广州', value: 38},
    {name: '延安', value: 38},
    {name: '太原', value: 39},
    {name: '清远', value: 39},
    {name: '中山', value: 39},
    {name: '昆明', value: 39},
    {name: '寿光', value: 40},
    {name: '盘锦', value: 40},
    {name: '长治', value: 41},
    {name: '深圳', value: 41},
    {name: '珠海', value: 42},
    {name: '宿迁', value: 43},
    {name: '咸阳', value: 43},
    {name: '铜川', value: 44},
    {name: '平度', value: 44},
    {name: '佛山', value: 44},
    {name: '海口', value: 44},
    {name: '江门', value: 45},
    {name: '章丘', value: 45},
    {name: '肇庆', value: 46},
    {name: '大连', value: 47},
    {name: '临汾', value: 47},
    {name: '吴江', value: 47},
    {name: '石嘴山', value: 49},
    {name: '沈阳', value: 50},
    {name: '苏州', value: 50},
    {name: '茂名', value: 50},
    {name: '嘉兴', value: 51},
    {name: '长春', value: 51},
    {name: '胶州', value: 52},
    {name: '银川', value: 52},
    {name: '张家港', value: 52},
    {name: '三门峡', value: 53},
    {name: '锦州', value: 54},
    {name: '南昌', value: 54},
    {name: '柳州', value: 54},
    {name: '三亚', value: 54},
    {name: '自贡', value: 56},
    {name: '吉林', value: 56},
    {name: '阳江', value: 57},
    {name: '泸州', value: 57},
    {name: '西宁', value: 57},
    {name: '宜宾', value: 58},
    {name: '呼和浩特', value: 58},
    {name: '成都', value: 58},
    {name: '大同', value: 58},
    {name: '镇江', value: 59},
    {name: '桂林', value: 59},
    {name: '张家界', value: 59},
    {name: '宜兴', value: 59},
    {name: '北海', value: 60},
    {name: '西安', value: 61},
    {name: '金坛', value: 62},
    {name: '东营', value: 62},
    {name: '牡丹江', value: 63},
    {name: '遵义', value: 63},
    {name: '绍兴', value: 63},
    {name: '扬州', value: 64},
    {name: '常州', value: 64},
    {name: '潍坊', value: 65},
    {name: '重庆', value: 66},
    {name: '台州', value: 67},
    {name: '南京', value: 67},
    {name: '滨州', value: 70},
    {name: '贵阳', value: 71},
    {name: '无锡', value: 71},
    {name: '本溪', value: 71},
    {name: '克拉玛依', value: 72},
    {name: '渭南', value: 72},
    {name: '马鞍山', value: 72},
    {name: '宝鸡', value: 72},
    {name: '焦作', value: 75},
    {name: '句容', value: 75},
    {name: '北京', value: 79},
    {name: '徐州', value: 79},
    {name: '衡水', value: 80},
    {name: '包头', value: 80},
    {name: '绵阳', value: 80},
    {name: '乌鲁木齐', value: 84},
    {name: '枣庄', value: 84},
    {name: '杭州', value: 84},
    {name: '淄博', value: 85},
    {name: '鞍山', value: 86},
    {name: '溧阳', value: 86},
    {name: '库尔勒', value: 86},
    {name: '安阳', value: 90},
    {name: '开封', value: 90},
    {name: '济南', value: 92},
    {name: '德阳', value: 93},
    {name: '温州', value: 95},
    {name: '九江', value: 96},
    {name: '邯郸', value: 98},
    {name: '临安', value: 99},
    {name: '兰州', value: 99},
    {name: '沧州', value: 100},
    {name: '临沂', value: 103},
    {name: '南充', value: 104},
    {name: '天津', value: 105},
    {name: '富阳', value: 106},
    {name: '泰安', value: 112},
    {name: '诸暨', value: 112},
    {name: '郑州', value: 113},
    {name: '哈尔滨', value: 114},
    {name: '聊城', value: 116},
    {name: '芜湖', value: 117},
    {name: '唐山', value: 119},
    {name: '平顶山', value: 119},
    {name: '邢台', value: 119},
    {name: '德州', value: 120},
    {name: '济宁', value: 120},
    {name: '荆州', value: 127},
    {name: '宜昌', value: 130},
    {name: '义乌', value: 132},
    {name: '丽水', value: 133},
    {name: '洛阳', value: 134},
    {name: '秦皇岛', value: 136},
    {name: '株洲', value: 143},
    {name: '石家庄', value: 147},
    {name: '莱芜', value: 148},
    {name: '常德', value: 152},
    {name: '保定', value: 153},
    {name: '湘潭', value: 154},
    {name: '金华', value: 157},
    {name: '岳阳', value: 169},
    {name: '长沙', value: 175},
    {name: '衢州', value: 177},
    {name: '廊坊', value: 193},
    {name: '菏泽', value: 194},
    {name: '合肥', value: 229},
    {name: '武汉', value: 273},
    {name: '大庆', value: 279}
  ]
  var geoCoordMap = {
    '海门': [121.15, 31.89],
    '鄂尔多斯': [109.781327, 39.608266],
    '招远': [120.38, 37.35],
    '舟山': [122.207216, 29.985295],
    '齐齐哈尔': [123.97, 47.33],
    '盐城': [120.13, 33.38],
    '赤峰': [118.87, 42.28],
    '青岛': [120.33, 36.07],
    '乳山': [121.52, 36.89],
    '金昌': [102.188043, 38.520089],
    '泉州': [118.58, 24.93],
    '莱西': [120.53, 36.86],
    '日照': [119.46, 35.42],
    '胶南': [119.97, 35.88],
    '南通': [121.05, 32.08],
    '拉萨': [91.11, 29.97],
    '云浮': [112.02, 22.93],
    '梅州': [116.1, 24.55],
    '文登': [122.05, 37.2],
    '上海': [121.48, 31.22],
    '攀枝花': [101.718637, 26.582347],
    '威海': [122.1, 37.5],
    '承德': [117.93, 40.97],
    '厦门': [118.1, 24.46],
    '汕尾': [115.375279, 22.786211],
    '潮州': [116.63, 23.68],
    '丹东': [124.37, 40.13],
    '太仓': [121.1, 31.45],
    '曲靖': [103.79, 25.51],
    '烟台': [121.39, 37.52],
    '福州': [119.3, 26.08],
    '瓦房店': [121.979603, 39.627114],
    '即墨': [120.45, 36.38],
    '抚顺': [123.97, 41.97],
    '玉溪': [102.52, 24.35],
    '张家口': [114.87, 40.82],
    '阳泉': [113.57, 37.85],
    '莱州': [119.942327, 37.177017],
    '湖州': [120.1, 30.86],
    '汕头': [116.69, 23.39],
    '昆山': [120.95, 31.39],
    '宁波': [121.56, 29.86],
    '湛江': [110.359377, 21.270708],
    '揭阳': [116.35, 23.55],
    '荣成': [122.41, 37.16],
    '连云港': [119.16, 34.59],
    '葫芦岛': [120.836932, 40.711052],
    '常熟': [120.74, 31.64],
    '东莞': [113.75, 23.04],
    '河源': [114.68, 23.73],
    '淮安': [119.15, 33.5],
    '泰州': [119.9, 32.49],
    '南宁': [108.33, 22.84],
    '营口': [122.18, 40.65],
    '惠州': [114.4, 23.09],
    '江阴': [120.26, 31.91],
    '蓬莱': [120.75, 37.8],
    '韶关': [113.62, 24.84],
    '嘉峪关': [98.289152, 39.77313],
    '广州': [113.23, 23.16],
    '延安': [109.47, 36.6],
    '太原': [112.53, 37.87],
    '清远': [113.01, 23.7],
    '中山': [113.38, 22.52],
    '昆明': [102.73, 25.04],
    '寿光': [118.73, 36.86],
    '盘锦': [122.070714, 41.119997],
    '长治': [113.08, 36.18],
    '深圳': [114.07, 22.62],
    '珠海': [113.52, 22.3],
    '宿迁': [118.3, 33.96],
    '咸阳': [108.72, 34.36],
    '铜川': [109.11, 35.09],
    '平度': [119.97, 36.77],
    '佛山': [113.11, 23.05],
    '海口': [110.35, 20.02],
    '江门': [113.06, 22.61],
    '章丘': [117.53, 36.72],
    '肇庆': [112.44, 23.05],
    '大连': [121.62, 38.92],
    '临汾': [111.5, 36.08],
    '吴江': [120.63, 31.16],
    '石嘴山': [106.39, 39.04],
    '沈阳': [123.38, 41.8],
    '苏州': [120.62, 31.32],
    '茂名': [110.88, 21.68],
    '嘉兴': [120.76, 30.77],
    '长春': [125.35, 43.88],
    '胶州': [120.03336, 36.264622],
    '银川': [106.27, 38.47],
    '张家港': [120.555821, 31.875428],
    '三门峡': [111.19, 34.76],
    '锦州': [121.15, 41.13],
    '南昌': [115.89, 28.68],
    '柳州': [109.4, 24.33],
    '三亚': [109.511909, 18.252847],
    '自贡': [104.778442, 29.33903],
    '吉林': [126.57, 43.87],
    '阳江': [111.95, 21.85],
    '泸州': [105.39, 28.91],
    '西宁': [101.74, 36.56],
    '宜宾': [104.56, 29.77],
    '呼和浩特': [111.65, 40.82],
    '成都': [104.06, 30.67],
    '大同': [113.3, 40.12],
    '镇江': [119.44, 32.2],
    '桂林': [110.28, 25.29],
    '张家界': [110.479191, 29.117096],
    '宜兴': [119.82, 31.36],
    '北海': [109.12, 21.49],
    '西安': [108.95, 34.27],
    '金坛': [119.56, 31.74],
    '东营': [118.49, 37.46],
    '牡丹江': [129.58, 44.6],
    '遵义': [106.9, 27.7],
    '绍兴': [120.58, 30.01],
    '扬州': [119.42, 32.39],
    '常州': [119.95, 31.79],
    '潍坊': [119.1, 36.62],
    '重庆': [106.54, 29.59],
    '台州': [121.420757, 28.656386],
    '南京': [118.78, 32.04],
    '滨州': [118.03, 37.36],
    '贵阳': [106.71, 26.57],
    '无锡': [120.29, 31.59],
    '本溪': [123.73, 41.3],
    '克拉玛依': [84.77, 45.59],
    '渭南': [109.5, 34.52],
    '马鞍山': [118.48, 31.56],
    '宝鸡': [107.15, 34.38],
    '焦作': [113.21, 35.24],
    '句容': [119.16, 31.95],
    '北京': [116.46, 39.92],
    '徐州': [117.2, 34.26],
    '衡水': [115.72, 37.72],
    '包头': [110, 40.58],
    '绵阳': [104.73, 31.48],
    '乌鲁木齐': [87.68, 43.77],
    '枣庄': [117.57, 34.86],
    '杭州': [120.19, 30.26],
    '淄博': [118.05, 36.78],
    '鞍山': [122.85, 41.12],
    '溧阳': [119.48, 31.43],
    '库尔勒': [86.06, 41.68],
    '安阳': [114.35, 36.1],
    '开封': [114.35, 34.79],
    '济南': [117, 36.65],
    '德阳': [104.37, 31.13],
    '温州': [120.65, 28.01],
    '九江': [115.97, 29.71],
    '邯郸': [114.47, 36.6],
    '临安': [119.72, 30.23],
    '兰州': [103.73, 36.03],
    '沧州': [116.83, 38.33],
    '临沂': [118.35, 35.05],
    '南充': [106.110698, 30.837793],
    '天津': [117.2, 39.13],
    '富阳': [119.95, 30.07],
    '泰安': [117.13, 36.18],
    '诸暨': [120.23, 29.71],
    '郑州': [113.65, 34.76],
    '哈尔滨': [126.63, 45.75],
    '聊城': [115.97, 36.45],
    '芜湖': [118.38, 31.33],
    '唐山': [118.02, 39.63],
    '平顶山': [113.29, 33.75],
    '邢台': [114.48, 37.05],
    '德州': [116.29, 37.45],
    '济宁': [116.59, 35.38],
    '荆州': [112.239741, 30.335165],
    '宜昌': [111.3, 30.7],
    '义乌': [120.06, 29.32],
    '丽水': [119.92, 28.45],
    '洛阳': [112.44, 34.7],
    '秦皇岛': [119.57, 39.95],
    '株洲': [113.16, 27.83],
    '石家庄': [114.48, 38.03],
    '莱芜': [117.67, 36.19],
    '常德': [111.69, 29.05],
    '保定': [115.48, 38.85],
    '湘潭': [112.91, 27.87],
    '金华': [119.64, 29.12],
    '岳阳': [113.09, 29.37],
    '长沙': [113, 28.21],
    '衢州': [118.88, 28.97],
    '廊坊': [116.7, 39.53],
    '菏泽': [115.480656, 35.23375],
    '合肥': [117.27, 31.86],
    '武汉': [114.31, 30.52],
    '大庆': [125.03, 46.58]
  }
  if (chartObj.x.title !== '' && chartObj.x.title !== undefined) {
    xName = chartObj.x.title
  }
  if (chartObj.x.unit !== '' && chartObj.x.unit !== undefined) {
    xName += '(' + chartObj.x.unit + ')'
  }
  if (chartObj.y.title !== '' && chartObj.y.title !== undefined) {
    yName = chartObj.y.title
  }
  if (chartObj.y.unit !== '' && chartObj.y.unit !== undefined) {
    yName += '(' + chartObj.y.unit + ')'
  }
  /* 折线图,柱状图,堆叠柱状图,瀑布图,条形图,堆叠条形图,面积图,堆叠面积图,散点图 */
  if (['line', 'bar', 'stack-bar', 'waterfall', 'transverse-bar', 'stack-transverse-bar', 'area-line', 'stack-area-line', 'scatter', 'line-and-bar', 'k'].indexOf(chartObj.type) !== -1) {
    obj = {
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        feature: {
          restore: {show: true},
          saveAsImage: {show: true}
        },
        right: 25
      },
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      xAxis: [
        {
          name: xName,
          nameLocation: chartObj.x.location,
          nameGap: 20,
          nameTextStyle: {
            fontSize: chartObj.x.nameFontSize,
            color: chartObj.x.nameColor
          },
          axisLine: {
            show: chartObj.x.show,
            lineStyle: {
              width: chartObj.x.lineWidth,
              color: chartObj.x.lineColor,
              type: chartObj.x.lineType
            }
          },
          axisLabel: {
            show: chartObj.x.showLabels,
            interval: chartObj.x.showAll ? '0' : 'auto',
            rotate: chartObj.x.rotation,
            fontSize: chartObj.x.labelFontSize,
            color: chartObj.x.labelColor
          },
          splitLine: {
            show: chartObj.x.showSplitLine,
            lineStyle: {
              width: chartObj.x.splitLineWidth,
              color: chartObj.x.splitLineColor,
              type: chartObj.x.splitLineType
            }
          },
          type: 'category',
          data: xData
        }
      ],
      yAxis: [
        {
          nameTextStyle: {
            fontSize: chartObj.y.nameFontSize,
            color: chartObj.y.nameColor
          },
          axisLine: {
            show: chartObj.y.show,
            lineStyle: {
              width: chartObj.y.lineWidth,
              color: chartObj.y.lineColor,
              type: chartObj.y.lineType
            }
          },
          axisLabel: {
            show: chartObj.y.showLabels,
            fontSize: chartObj.y.labelFontSize,
            color: chartObj.y.labelColor
          },
          splitLine: {
            show: chartObj.y.showSplitLine,
            lineStyle: {
              width: chartObj.y.splitLineWidth,
              color: chartObj.y.splitLineColor,
              type: chartObj.y.splitLineType
            }
          },
          type: 'value'
        }
      ],
      series: []
    }
    /* 条形图,堆叠条形图 */
    if (['transverse-bar', 'stack-transverse-bar'].indexOf(chartObj.type) !== -1) {
      obj.xAxis[0].type = 'value'
      delete obj.xAxis[0].data
      obj.yAxis[0].type = 'category'
      obj.yAxis[0].data = xData
    }
    let legend = []
    for (let i = 0; i < yField.length; i++) {
      let name = (yField[i].alias !== '' && yField[i].alias !== undefined) ? yField[i].alias : yField[i].title
      obj.series.push({
        name: name,
        type: type,
        label: {
          show: chartObj.showDatalabels,
          fontSize: chartObj.datalabelFontSize
        },
        data: yData[i]
      })
      /* 颜色 */
      if (['line', 'area-line', 'stack-area-line'].indexOf(chartObj.type) !== -1 || ['line'].indexOf(yFieldType) !== -1) {
        obj.series[i].lineStyle = {normal: {color: yField[i].color}}
        obj.series[i].itemStyle = {normal: {color: yField[i].color}}
        /* 是否阶梯显示 */
        obj.series[i].step = chartObj.lineStep === 'false' ? false : chartObj.lineStep
        /* 是否平滑曲线显示 */
        obj.series[i].smooth = chartObj.lineStyle === 'curve' ? 'true' : false
      }
      if (['k'].indexOf(chartObj.type) !== -1) {
        obj.series[i].itemStyle = {normal: {color: chartObj.k.color, borderColor: chartObj.k.borderColor, color0: chartObj.k.color0, borderColor0: chartObj.k.borderColor0}}
      }
      /* 柱宽度 */
      if (['bar', 'stack-bar', 'transverse-bar', 'stack-transverse-bar', 'waterfall', 'line-and-bar', 'k'].indexOf(chartObj.type) !== -1) {
        if (chartObj.barWidthType === 'true') {
          obj.series[i].barWidth = chartObj.barWidth
        }
      }
      if (['bar', 'stack-bar', 'waterfall', 'transverse-bar', 'stack-transverse-bar', 'scatter'].indexOf(chartObj.type) !== -1 || ['bar', 'stack-bar'].indexOf(yFieldType) !== -1) {
        obj.series[i].itemStyle = {normal: {color: yField[i].color}}
      }
      /* 堆叠 */
      if (['stack-bar', 'waterfall', 'stack-transverse-bar', 'stack-area-line'].indexOf(chartObj.type) !== -1 || ['stack-bar'].indexOf(yFieldType) !== -1) {
        obj.series[i].stack = 'stack'
      }
      /* 面积 */
      if (['area-line', 'stack-area-line'].indexOf(chartObj.type) !== -1) {
        obj.series[i].areaStyle = {}
      }
      /* 散点图 */
      if (['scatter'].indexOf(chartObj.type) !== -1) {
        delete obj.xAxis[0].data
        obj.series[i].data = scatterData[i]
        obj.series[i].symbolSize = chartObj.symbolSize
      }
      legend.push(name)
    }
    /* 双轴图 */
    if (['line-and-bar'].indexOf(chartObj.type) !== -1) {
      let sYName = ''
      if (chartObj.rightY.showTitle) {
        sYName = (chartObj.rightY.title !== '' && chartObj.rightY.title !== undefined) ? chartObj.rightY.title : ''
        sYName += (chartObj.rightY.unit !== '' && chartObj.rightY.unit !== undefined) ? '(' + chartObj.rightY.unit + ')' : ''
      }
      obj.yAxis.push({
        name: sYName,
        nameTextStyle: {
          fontSize: chartObj.rightY.nameFontSize,
          color: chartObj.rightY.nameColor
        },
        axisLine: {
          show: chartObj.rightY.show,
          lineStyle: {
            width: chartObj.rightY.lineWidth,
            color: chartObj.rightY.lineColor,
            type: chartObj.rightY.lineType
          }
        },
        axisLabel: {
          show: chartObj.rightY.showLabels,
          fontSize: chartObj.rightY.labelFontSize,
          color: chartObj.rightY.labelColor
        },
        type: 'value'
      })
      for (let i = 0; i < secondaryYField.length; i++) {
        obj.series.push({
          name: (secondaryYField[i].alias !== '' && secondaryYField[i].alias !== undefined) ? secondaryYField[i].alias : secondaryYField[i].title,
          type: secondaryYFieldType === 'stack-bar' ? 'bar' : secondaryYFieldType,
          label: {
            show: chartObj.showDatalabels,
            fontSize: chartObj.datalabelFontSize
          },
          itemStyle: {normal: {color: secondaryYField[i].color}},
          yAxisIndex: 1,
          data: sYData[i]
        })
        if (secondaryYFieldType === 'line') {
          /* 颜色 */
          obj.series[obj.series.length - 1].lineStyle = {normal: {color: secondaryYField[i].color}}
          /* 是否阶梯显示 */
          obj.series[obj.series.length - 1].step = chartObj.lineStep === 'false' ? false : chartObj.lineStep
          /* 是否平滑曲线显示 */
          obj.series[obj.series.length - 1].smooth = chartObj.lineStyle === 'curve' ? 'true' : false
        }
        /* 堆叠 */
        if (secondaryYFieldType === 'stack-bar') {
          obj.series[obj.series.length - 1].stack = 'stack'
        }
      }
    }
    /* 瀑布图 */
    if (['waterfall'].indexOf(chartObj.type) !== -1) {
      if (xField.length === 1 && yField.length === 1) {
        for (let i = 1; i < yData[0].length; i++) {
          waterfallData[i] = waterfallData[i - 1] + yData[0][i - 1]
        }
        obj.tooltip = {
          trigger: 'axis',
          formatter: function (params) {
            let temp = params[0].name + '<br/>'
            for (let i = 1; i < params.length; i++) {
              temp += params[i].seriesName + ' : ' + params[i].value + '<br/>'
            }
            return temp
          }
        }
        obj.series.unshift({
          name: '总量',
          type: type,
          stack: 'stack',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: waterfallData
        })
      }
    }
    /* K线图 */
    if (['k'].indexOf(chartObj.type) !== -1) {
      obj.series[0].data = kData
    }
    obj.xAxis[0].name = chartObj.x.showTitle ? xName : ''
    obj.yAxis[0].name = chartObj.y.showTitle ? yName : ''
    if (yField.length > 1) {
      obj.legend = {data: legend}
    }
  }
  /* 饼图,漏斗图 */
  if (['pie', 'funnel'].indexOf(chartObj.type) !== -1) {
    let pieData = []
    let legend = []
    if (xField.length === 1 && yField.length === 1) {
      for (let i = 0; i < xData.length; i++) {
        pieData.push({
          name: xData[i],
          value: yData[0][i]
        })
        legend.push(xData[i])
      }
    }
    if (xField.length === 0 && yField.length > 1) {
      for (let i = 0; i < yField.length; i++) {
        let name = (yField[i].alias !== '' && yField[i].alias !== undefined) ? yField[i].alias : yField[i].title
        pieData.push({
          name: name,
          value: yData[i]
        })
        legend.push(name)
      }
    }
    obj = {
      tooltip: {
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        data: legend
      },
      color: colorTheme.colors,
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      series: [
        {
          name: yName,
          type: chartObj.type,
          label: {
            show: chartObj.showDatalabels,
            fontSize: chartObj.datalabelFontSize
          },
          funnelAlign: chartObj.funnelAlign,
          data: pieData
        }
      ]
    }
    if (['pie'].indexOf(chartObj.type) !== -1) {
      obj.series[0].radius = chartObj.pieStyle === 'pieShape' ? [0, '75%'] : ['50%', '75%']
      obj.series[0].roseType = chartObj.pieRose === 'false' ? false : chartObj.pieRose
      if (chartObj.legend.position === 'null') {
        delete obj.legend
      } else {
        obj.legend[chartObj.legend.position] = 5
        obj.legend.orient = ['left', 'right'].indexOf(chartObj.legend.position) !== -1 ? 'vertical' : 'horizontal'
      }
    }
  }
  /* 仪表盘 */
  if (chartObj.type === 'gauge') {
    let name = ''
    if (chartObj.gauge.title !== '' && chartObj.gauge.title !== undefined) {
      name = chartObj.gauge.title
    } else {
      name = (yField[0].alias !== '' && yField[0].alias !== undefined) ? yField[0].alias : yField[0].title
    }
    let formatter = ''
    let rateDigit = 0
    let temp = 0.0
    let max = 1
    if (chartObj.gauge.rateDigit !== '' && chartObj.gauge.rateDigit !== undefined) {
      rateDigit = chartObj.gauge.rateDigit
    }
    if (chartObj.gauge.max !== '' && chartObj.gauge.max !== undefined && chartObj.gauge.max >= 820) {
      temp = (this.FloatDiv(820, chartObj.gauge.max) * 100).toFixed(rateDigit)
      formatter = '{b} : {c}(' + temp + '%)'
      max = chartObj.gauge.max
    } else {
      formatter = '{b} : {c}'
      max = 820
    }
    obj = {
      tooltip: {
        formatter: formatter
      },
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      axisLabel: {
        formatter: (chartObj.gauge.unit !== '' && chartObj.gauge.unit !== undefined) ? '{value}' + chartObj.gauge.unit : '{value}'
      },
      series: [
        {
          type: chartObj.type,
          max: max,
          axisLine: {
            lineStyle: {}
          },
          data: [{name: name, value: 820}]
        }
      ]
    }
    if (chartObj.gauge.title !== '' && chartObj.gauge.title !== undefined) {
      obj.series[0].name = chartObj.gauge.title
    }
    if (chartObj.gauge.max !== '' && chartObj.gauge.max !== undefined) {
      obj.series[0].max = chartObj.gauge.max
    }
    let colors = []
    for (let i = 0; i < chartObj.gauge.conditions.length; i++) {
      colors.push([parseFloat(chartObj.gauge.conditions[i].max), chartObj.gauge.conditions[i].color])
    }
    obj.series[0].axisLine.lineStyle.color = colors
  }
  /* 雷达图 */
  if (chartObj.type === 'radar') {
    let legend = []
    let radarData = []
    let indicator = []
    for (let i = 0; i < yField.length; i++) {
      let name = (yField[i].alias !== '' && yField[i].alias !== undefined) ? yField[i].alias : yField[i].title
      legend.push(name)
      radarData.push({name: name, value: yData[i], lineStyle: {normal: {color: yField[i].color}}, itemStyle: {normal: {color: yField[i].color}}})
    }
    for (let j = 0; j < xData.length; j++) {
      indicator[j] = {name: xData[j], max: radarMax[j]}
    }
    obj = {
      tooltip: {},
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      legend: {
        data: legend
      },
      radar: {
        name: {
          show: chartObj.x.showLabels
        },
        axisLine: {
          show: chartObj.x.show
        },
        indicator: indicator
      },
      series: [
        {
          name: yName,
          type: chartObj.type,
          label: {
            show: chartObj.showDatalabels,
            fontSize: chartObj.datalabelFontSize
          },
          data: radarData
        }
      ]
    }
    if (chartObj.radarStyle === 'area') {
      obj.series[0].areaStyle = {}
    }
  }
  /* 矩形树图 */
  if (chartObj.type === 'treemap') {
    obj = {
      tooltip: {},
      color: colorTheme.colors,
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      series: [{
        type: 'treemap',
        itemStyle: {
          normal: {
            borderColor: chartObj.treemap.borderColor,
            borderWidth: chartObj.treemap.borderWidth,
            gapWidth: chartObj.treemap.gapWidth
          }
        },
        breadcrumb: {
          show: chartObj.treemap.breadcrumb.show,
          height: chartObj.treemap.breadcrumb.height,
          itemStyle: {
            normal: {
              color: chartObj.treemap.breadcrumb.color,
              borderColor: chartObj.treemap.breadcrumb.borderColor,
              borderWidth: chartObj.treemap.breadcrumb.borderWidth,
              shadowBlur: chartObj.treemap.breadcrumb.shadowBlur,
              shadowColor: chartObj.treemap.breadcrumb.shadowColor,
              textStyle: {
                color: chartObj.treemap.breadcrumb.textColor,
                fontSize: chartObj.treemap.breadcrumb.fontSize
              }
            }
          }
        },
        data: treemapData
      }]
    }
    if (chartObj.treemap.levels.length > 0) {
      obj.series[0].levels = []
      for (let iterator of chartObj.treemap.levels) {
        obj.series[0].levels.push({
          itemStyle: {
            normal: {
              borderColor: iterator.borderColor,
              borderWidth: iterator.borderWidth,
              gapWidth: iterator.gapWidth
            }
          }
        })
      }
    }
  }
  /* 旭日图 */
  if (chartObj.type === 'sunburst') {
    obj = {
      tooltip: {},
      color: colorTheme.colors,
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      series: [{
        type: 'sunburst',
        radius: [`${chartObj.sunburst.innerRadius}%`, `${chartObj.sunburst.outerRadius}%`],
        data: sunburstData
      }]
    }
  }
  /* 桑基图 */
  if (chartObj.type === 'sankey') {
    obj = {
      tooltip: {},
      color: colorTheme.colors,
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      series: [{
        type: 'sankey',
        data: sankeyData,
        links: sankeyLink,
        nodeWidth: chartObj.sankey.nodeWidth,
        label: {
          normal: {
            color: chartObj.sankey.label.color,
            fontSize: chartObj.sankey.label.fontSize
          }
        },
        lineStyle: {
          normal: {
            color: chartObj.sankey.lineColor
          }
        }
      }]
    }
    if (chartObj.lineStyle === 'straight') {
      obj.series[0].lineStyle.normal.curveness = 0
    } else if (chartObj.lineStyle === 'curve') {
      obj.series[0].lineStyle.normal.curveness = 0.5
    }
  }
  /* 地图 */
  if (chartObj.type === 'map') {
    let data = this.convertData(mapData, geoCoordMap)
    // console.log(data)
    obj = {
      tooltip: {},
      color: colorTheme.colors,
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      bmap: {
        center: [chartObj.map.centerX, chartObj.map.centerY],
        zoom: chartObj.map.zoom,
        roam: true,
        mapStyle: {
          styleJson: [{
            'featureType': 'water', // 调整水颜色
            'elementType': 'all',
            'stylers': {
              'color': chartObj.map.waterColor
            }
          }, {
            'featureType': 'land', // 调整土地颜色
            'elementType': 'all',
            'stylers': {
              'color': chartObj.map.landColor
            }
          }, {
            'featureType': 'building', // 调整建筑物颜色
            'elementType': 'all',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'building', // 调整建筑物颜色
            'elementType': 'geometry.fill',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'local', // 调整局部的颜色
            'elementType': 'geometry.fill',
            'stylers': {
              'color': chartObj.map.arterialColor
            }
          }, {
            'featureType': 'manmade', // 调整人造的颜色
            'elementType': 'geometry',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'entertainment', // 调整娱乐颜色
            'elementType': 'geometry',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'shopping', // 调整购物颜色
            'elementType': 'geometry',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'education', // 调整学校颜色
            'elementType': 'geometry',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'medical', // 调整医院颜色
            'elementType': 'geometry',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'scenicspots', // 调整景点颜色
            'elementType': 'geometry',
            'stylers': {
              'color': chartObj.map.buildingColor
            }
          }, {
            'featureType': 'arterial', // 调整一些干道颜色
            'elementType': 'geometry',
            'stylers': {
              'color': chartObj.map.arterialColor
            }
          }, {
            'featureType': 'railway', // 调整铁路是否可视
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'green', // 调整绿景是否可视
            'elementType': 'all',
            'stylers': {
              'visibility': 'off'
            }
          }, {
            'featureType': 'highway', // 调整高速道路颜色
            'elementType': 'all',
            'stylers': {
              'color': chartObj.map.highwayColor
            }
          }]
        }
      },
      series: [{
        type: 'scatter',
        coordinateSystem: 'bmap',
        data: data,
        symbolSize: chartObj.symbolSize,
        label: {
          show: chartObj.showDatalabels,
          fontSize: chartObj.datalabelFontSize,
          color: chartObj.datalabelColor
        },
        itemStyle: {
          normal: {
            color: yField[0].color
          }
        }
      }]
    }
  }
  if (chartObj.showTitle) {
    obj.title = {
      text: chartObj.title,
      textStyle: {
        fontSize: chartObj.titleFontSize,
        color: chartObj.titleColor
      }
    }
  }
  console.log(obj)
  return obj
}

util.convertData = function (data, geoCoordMap) {
  var res = []
  for (var i = 0; i < data.length; i++) {
    var geoCoord = geoCoordMap[data[i].name]
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      })
    }
  }
  return res
}

export default util
