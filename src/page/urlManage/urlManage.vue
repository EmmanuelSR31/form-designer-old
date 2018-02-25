<template>
<div>
  <Row>
    <Col span="8">
      <div class="bg-white padding10">
        <Tree :data="treeData" @on-select-change="initUrls"></Tree>
      </div>
    </Col>
    <Col span="15" offset="1">
      <div class="table-search-con">
        <Button type="primary" @click="addUrl">新增</Button>
      </div>
      <Table border :loading="loading" :columns="columns" :data="data" stripe></Table>
    </Col>
  </Row>
</div>
</template>
<script>
import Util from '@/utils/index'
import addUrl from './addUrl.vue'
import editUrl from './editUrl.vue'
export default {
  data () {
    return {
      loading: false,
      treeData: [], // 栏目数据
      columns: [
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: 'pid',
          key: 'pid'
        },
        {
          title: '名称',
          key: 'name'
        },
        {
          title: '描述',
          key: 'descr'
        },
        {
          title: 'URL类型',
          key: 'type'
        },
        {
          title: '创建人',
          key: 'creater'
        },
        {
          title: '创建时间',
          key: 'create_date'
        },
        {
          title: '操作',
          key: 'action',
          width: 126,
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
                    this.editUrl(params)
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
                    this.deleteUrl(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      data: [], // url数据
      urlObj: {}, // url对象
      currentForm: '' // 选中栏目
    }
  },
  methods: {
    init: function () { // 取左侧栏目列表
      this.$api.post('/topJUI/index/getMenuList.do', {}, r => {
        if (r.data) {
          this.treeData = Util.formatterTreeData(r.data)
        }
      })
    },
    initUrls: function (row) { // 选择栏目
      this.loading = true
      this.currentForm = row[0].id
      this.data = []
      this.initUrlsData()
    },
    initUrlsData: function () { // 取链接数据
      this.loading = true
      this.$api.post('/develop/url/getByPid.do', {pid: this.currentForm}, r => {
        console.log(r.data)
        this.data = r.data
        this.loading = false
      })
    },
    addUrl: function () { // 新增URL
      if (this.currentSelect === '') {
        this.$Message.warning('请先选择一条目录')
      } else {
        this.$layer.iframe({
          type: 2,
          content: {
            content: addUrl, // 传递的组件对象
            parent: this, // 当前的vue对象
            data: {
              pid: this.currentForm
            }
          },
          shadeClose: false,
          shade: false,
          maxmin: true,
          area: ['800px', document.body.clientHeight - 20 + 'px'],
          title: '新增URL'
        })
      }
    },
    editUrl: function (row) { // 修改URL
      let temp = row.row
      delete temp._index
      delete temp.orwKey
      this.$layer.open({
        type: 2,
        content: {
          content: editUrl, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            urlObj: temp
          }
        },
        shadeClose: false,
        shade: false,
        maxmin: true,
        area: ['800px', document.body.clientHeight - 20 + 'px'],
        title: '修改URL'
      })
    },
    deleteUrl: function (row) { // 删除选项
      this.$Modal.confirm({
        title: '',
        content: '确认删除此选项？',
        onOk: () => {
          this.$api.post('/crm/ActionFormSelectUtil/Select/delete.do', {tableName: this.currentSelect, id: row.row.id}, r => {
            if (r.data === '0') {
              this.$Message.error('删除选项失败')
            } else {
              this.$Message.success('删除选项成功')
              this.loading = true
              this.$api.post('/crm/ActionFormUtil/getByTableName.do', {tableName: this.currentSelect}, r => {
                if (r.data) {
                  this.data = r.data.rows
                  this.loading = false
                }
              })
            }
          })
        },
        onCancel: () => {
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style>
</style>
