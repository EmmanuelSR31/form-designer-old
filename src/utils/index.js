let util = {}

util.inOf = function (arr, targetArr) { // 两数组是否有重复
  let res = true
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

util.oneOf = function (ele, targetArr) { // 数组是否包含
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

util.isEmpty = function (obj) { // 是否为空
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

util.copyArr = function (arr) { // 复制数组
  return arr.map((e) => {
    if (typeof e === 'object') {
      return Object.assign({}, e)
    } else {
      return e
    }
  })
}

util.removeLastComma = function (str) { // 删除最后的逗号
  if (str.lastIndexOf(',') === (str.length - 1)) {
    str = str.substring(0, str.length - 1)
  }
  return str
}

util.myTrim = function (str) { // 去除前后空格
  return str.replace(/^\s+|\s+$/gm, '')
}

util.fieldsAddType = function (fields) { // 字段组加数据类型
  for (var field of fields) {
    if (field.fieldType === 'numberbox') {
      if (field.precision === '0') {
        field.type = 'int'
      } else {
        field.type = 'float'
      }
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

util.getFormValues = function (fields) { // 保存数据格式化
  let data = []
  for (let variable in fields) {
    data.push({
      text: variable,
      value: '\'' + fields[variable] + '\''
    })
  }
  return data
}

util.removeFieldTable = function (fields) { // 去除不展示字段
  let arr = []
  for (let variable of fields) {
    if (variable.text !== 'create_user_id' && variable.text !== 'taskid' && variable.text !== 'pid') {
      arr.push(variable)
    }
  }
  return arr
}

util.fieldArrToObj = function (fields) { // 绑定字段数据
  let obj = {}
  for (let field of fields) {
    if (field.fieldType === 'numberbox') {
      obj[field.text] = 0
    } else if (field.fieldType === 'checkbox') {
      obj[field.text] = []
    } else {
      obj[field.text] = ''
    }
  }
  return obj
}

util.formatFormData = function (fields, dataObj) { // 处理表单数据
  delete dataObj.id
  delete dataObj.create_user_id
  delete dataObj.taskid
  delete dataObj._index
  delete dataObj._rowKey
  for (let field of fields) {
    if (field.fieldType === 'checkbox') {
      if (this.isEmpty(dataObj[field.text])) {
        dataObj[field.text] = []
      } else {
        dataObj[field.text] = dataObj[field.text].split(',')
      }
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

util.formatterTreeData = function (data) { // 格式化树数据
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

util.dataConvertForTree = function (tableData, treeField) { // 数据转换为树结构数据格式
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

util.columnsFormatter = function (columns) { // 表头属性修改
  for (let iterator of columns) {
    iterator.key = iterator.field
    delete iterator.field
  }
  return columns
}

util.getCurrentDate = function () { // 获取当前日期
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

util.uuid = function () { // 生成uuid
  function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

util.fieldsForSelect = function (fields) { // 字段去除属性禁用
  let arr = fields.concat()
  for (let iterator of arr) {
    delete iterator.disabled
    delete iterator.readonly
  }
  return arr
}

util.FloatAdd = function (arg1, arg2) { // 浮点数加法运算
  let r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

util.FloatSub = function (arg1, arg2) { // 浮点数减法运算
  let r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  n = (r1 = r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

util.FloatMul = function (arg1, arg2) { // 浮点数乘法运算
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) {}
  try { m += s2.split('.')[1].length } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

util.strToBool = function (str) { // string转为Boolean
  if (str === 'true') {
    return true
  } else if (str === 'false') {
    return false
  }
}

util.comboboxColumns = function (variable, selectData) { // 生成下拉表头
  let column = {
    title: variable.title,
    key: variable.text,
    width: 80,
    align: 'center',
    render: (h, params) => {
      let fieldText = params.column.key
      let selectId = variable.selectID
      let valueTemp = ''
      if (!this.isEmpty(params.row[fieldText]) && !this.isEmpty(selectData[selectId])) {
        let valueTemp1 = selectData[selectId].find(function (value, index, arr) {
          if (value.id.toString() === params.row[fieldText]) {
            return value
          }
        })
        if (!this.isEmpty(valueTemp1)) {
          valueTemp = valueTemp1.text
        }
      }
      return h('div', valueTemp)
    }
  }
  return column
}

util.fileColumns = function (variable) { // 生成附件表头
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
  return column
}

util.setCookie = function (name, value) {
  let Days = 7
  let exp = new Date()
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

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

util.delCookie = function (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = this.getCookie(name)
  if (cval !== null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

util.flowStateFormat = function (value) {
  if (value === 'Ready') {
    return '可领取'
  } else if (value === 'Completed') {
    return '已完成'
  } else if (value === 'Forwarded') {
    return '已跳转'
  } else if (value === 'Created') {
    return '已创建'
  } else if (value === 'Reserved') {
    return '预分配'
  } else if (value === 'Withdraw') {
    return '退回'
  }
}

export default util
