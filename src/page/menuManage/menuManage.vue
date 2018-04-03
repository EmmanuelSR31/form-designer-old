<template>
<div>
  <Row>
    <Col span="8">
      <div class="table-search-con">
        <Button type="primary" @click="addMenu">新增</Button>
      </div>
      <div class="bg-white padding10">
        <Tree :data="data" @on-select-change="initMenu"></Tree>
      </div>
    </Col>
    <Col span="15" offset="1">
      <Form :model="menuObj" :label-width="120">
        <FormItem label="名称">
          <Input v-model="menuObj.text"></Input>
        </FormItem>
        <FormItem label="图标">
          <Input v-model="menuObj.iconCls"></Input>
        </FormItem>
        <FormItem label="开合状态">
          <Select v-model="menuObj.state">
            <Option value="open">打开</Option>
            <Option value="closed">关闭</Option>
          </Select>
        </FormItem>
        <FormItem label="连接地址">
          <Input v-model="menuObj.url"></Input>
        </FormItem>
      </Form>
      <div class="text-center">
        <Button class="mr100" @click="deleteMenu">删 除</Button>
        <Button type="primary" @click="saveMenu">保 存</Button>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
export default {
  data () {
    return {
      data: [], // 菜单数据
      menuObj: {}, // 当前菜单对象
      pid: '', // 上级菜单
      methodFlag: '' // 方法(新增或修改)
    }
  },
  methods: {
    init: function () { // 取菜单数据
      this.$api.post('/topJUI/index/getMenuList.do', {}, r => {
        if (r.data) {
          this.data = Util.formatterTreeData(r.data)
          console.log(r.data)
        }
      })
      this.menuObj = {}
      this.pid = ''
      this.methodFlag = ''
    },
    initMenu: function (row) { // 选中菜单
      this.menuObj = row[0]
      this.pid = this.menuObj.id
      this.methodFlag = 'edit'
    },
    addMenu: function () { // 新增菜单
      if (this.pid === '') {
        this.$Message.warning('请先选择一条目录')
      } else {
        this.methodFlag = 'add'
        this.menuObj = {}
      }
    },
    saveMenu: function () { // 保存菜单
      if (this.methodFlag === 'add') {
        this.menuObj.pid = this.pid
        this.menuObj.name = ''
        let jsonStr = JSON.stringify(this.menuObj)
        this.$api.post('/topJUI/index/save.do', {data: jsonStr}, r => {
          this.$Message.success('新建菜单成功')
          this.init()
        })
      } else if (this.methodFlag === 'edit') {
        delete this.menuObj.nodeKey
        delete this.menuObj.selected
        delete this.menuObj.children
        delete this.menuObj.title
        let jsonStr = JSON.stringify(this.menuObj)
        this.$api.post('/topJUI/index/save.do', {data: jsonStr}, r => {
          this.$Message.success('修改菜单成功')
          this.init()
        })
      }
    },
    deleteMenu: function () { // 删除菜单
      if (this.menuObj.id === undefined) {
        this.$Message.warning('请先选择一条菜单')
      } else {
        this.$Modal.confirm({
          title: '',
          content: '确认删除此菜单？',
          onOk: () => {
            delete this.menuObj.nodeKey
            delete this.menuObj.selected
            delete this.menuObj.children
            delete this.menuObj.title
            let jsonStr = JSON.stringify(this.menuObj)
            this.$api.post('/topJUI/index/delete.do', {data: jsonStr}, r => {
              this.$Message.success('删除菜单成功')
              this.init()
            })
          },
          onCancel: () => {
          }
        })
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
