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
    if (field.fieldType === 'textbox' || field.fieldType === 'textboxMultiline' || field.fieldType === 'tablebox' || field.fieldType === 'combobox') {
      field.type = 'varchar(255)'
    } else if (field.fieldType === 'numberbox') {
      if (field.precision === '0') {
        field.type = 'int'
      } else {
        field.type = 'float'
      }
    } else if (field.fieldType === 'datebox') {
      field.type = 'date'
    } else if (field.fieldType === 'datetimebox') {
      field.type = 'datetime'
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

util.removeFieldTable = function (fields) { // 去除字段子表
  let arr = []
  for (let variable of fields) {
    if (variable.text !== 'create_user_id' && variable.text !== 'taskid') {
      arr.push(variable)
    }
  }
  return arr
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
          }
        }
      }
    }
  }
  return data
}

util.getCurrentDate = function () { // 获取当前的日期
  let date = new Date()
  let seperator1 = '-'
  let seperator2 = ':'
  let month = date.getMonth() + 1
  let strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds()
  return currentdate
}

export default util
