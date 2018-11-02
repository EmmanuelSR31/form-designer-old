<template>
<div>
  <Row>
    <Col span="8">
      <div class="table-search-con">
        <Button type="primary" @click="addDepartment">新增</Button>
        <Button type="primary" @click="editDepartment">修改</Button>
        <Button type="primary" @click="deleteDepartment">删除</Button>
      </div>
      <div class="bg-white padding10">
        <Tree :data="departmentData" @on-select-change="initUsers"></Tree>
      </div>
    </Col>
    <Col span="15" offset="1">
      <div class="table-search-con">
        <Button type="primary" @click="addUser">新增</Button>
      </div>
      <Table border :loading="loading" :columns="columns" :data="data" stripe></Table>
    </Col>
  </Row>
  <Modal v-model="modalDepartment" :title="modalDepartmentTitle" @on-ok="saveDepartment">
    <div class="modal-field-con">
      <div>
        <Form :model="departmentObj" :label-width="120">
          <FormItem label="部门名称">
            <Input v-model="departmentObj.text"></Input>
          </FormItem>
          <FormItem label="部门类型">
            <Input v-model="departmentObj.type"></Input>
          </FormItem>
          <FormItem label="上级组织">
            <Input v-model="parentDepartment" readonly="true"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
  <Modal v-model="modalUser" :title="modalUserTitle" @on-ok="saveUser">
    <div class="modal-field-con">
      <div class="modal-field-2">
        <Form :model="userObj" :label-width="80">
          <FormItem label="用户名">
            <Input v-model="userObj.name"></Input>
          </FormItem>
          <FormItem label="真实姓名">
            <Input v-model="userObj.actual_name"></Input>
          </FormItem>
          <FormItem label="密码">
            <Input v-model="userObj.password"></Input>
          </FormItem>
          <FormItem label="电话">
            <Input v-model="userObj.phone_call"></Input>
          </FormItem>
          <FormItem label="邮件">
            <Input v-model="userObj.email"></Input>
          </FormItem>
          <FormItem label="部门">
            <Input v-model="selectDepartmentObj.text" readonly="true"></Input>
          </FormItem>
          <FormItem label="职位">
            <Select v-model="userObj.position_id">
              <Option v-for="item in positionList" :value="item.id" :key="item.id">{{item.text}}</Option>
            </Select>
          </FormItem>
          <FormItem label="状态">
            <Select v-model="userObj.status">
              <Option v-for="item in userStatusList" :value="item.id" :key="item.id">{{item.text}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
</div>
</template>
<script>
import Util from '@/utils/index'
export default {
  data () {
    return {
      loading: false, // 载入中
      departmentData: [], // 部门数据
      selectDepartmentObj: {}, // 当前部门
      departmentObj: {}, // 部门对象
      data: [], // 用户数据
      userObj: {}, // 用户对象
      pid: '', // 所属部门
      parentDepartment: '', // 所属部门名称
      modalDepartment: false, // 部门对话框是否显示
      modalUser: false, // 用户对话框是否显示
      modalDepartmentTitle: '新增部门', // 部门对话框标题
      modalUserTitle: '新增用户', // 用户对话框标题
      positionList: this.$store.state.positionList, // 用户职位列表
      userStatusList: this.$store.state.userStatusList, // 用户状态列表
      columns: [ // 表格表头
        {
          type: 'index',
          title: '序列',
          width: 64,
          align: 'center'
        },
        {
          title: '用户名',
          key: 'name'
        },
        {
          title: '实际姓名',
          key: 'actual_name'
        },
        {
          title: '电话',
          key: 'phone_call'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '注册时间',
          key: 'registration_date'
        },
        {
          title: '所在部门',
          key: 'dept'
        },
        {
          title: '职位',
          key: 'position'
        },
        {
          title: '状态',
          key: 'state'
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
                    this.editUser(params)
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
                    this.deleteUser(params)
                  }
                }
              }, '删除')
            ])
          }
        }
      ]
    }
  },
  methods: {
    /**
    * @desc 取左侧部门列表
    */
    init: function () {
      this.$api.post('/system/user/department/getAll.do', {}, r => {
        if (r.data) {
          this.departmentData = Util.formatterTreeData(r.data)
        }
      })
      this.data = []
    },
    /**
    * @desc 选择部门
    * @param {Array} row 选中的部门数组
    */
    initUsers: function (row) {
      this.selectDepartmentObj = row[0]
      this.pid = this.selectDepartmentObj.id
      this.initUsersData()
    },
    /**
    * @desc 取部门用户数据
    */
    initUsersData: function () {
      this.loading = true
      this.$api.post('/system/user/getUserByDepartment.do', {department: this.pid}, r => {
        if (r.data) {
          this.data = r.data.rows
        }
        this.loading = false
      })
    },
    /**
    * @desc 新增部门
    */
    addDepartment: function () {
      if (this.pid === '') {
        this.$Message.warning('请先选择一条数据')
      } else {
        this.modalDepartment = true
        this.modalDepartmentTitle = '新增部门'
        this.departmentObj = {}
        this.parentDepartment = this.selectDepartmentObj.text
      }
    },
    /**
    * @desc 修改部门
    */
    editDepartment: function () {
      if (this.pid === '') {
        this.$Message.warning('请先选择一条数据')
      } else {
        this.modalDepartment = true
        this.modalDepartmentTitle = '修改部门'
        this.departmentObj = this.selectDepartmentObj
        this.$api.post('/crm/ActionFormUtil/getDataById.do', {tableName: 'db_system_user_department', id: this.departmentObj.parent_id}, r => {
          if (r.data) {
            this.parentDepartment = r.data.rows[0].text
          }
        })
      }
    },
    /**
    * @desc 保存部门
    */
    saveDepartment: function () {
      if (this.departmentObj.id === undefined) {
        this.departmentObj.parent_id = this.pid
        let jsonStr = JSON.stringify(this.departmentObj)
        this.$api.post('/system/user/department/save.do', {data: jsonStr}, r => {
          if (r.data.result) {
            this.$Message.success('新增部门成功')
            this.init()
          } else {
            this.$Message.error('新增部门失败')
          }
        })
      } else {
        delete this.departmentObj.nodeKey
        delete this.departmentObj.selected
        delete this.departmentObj.title
        let jsonStr = JSON.stringify(this.departmentObj)
        this.$api.post('/system/user/department/save.do', {data: jsonStr}, r => {
          if (r.data.result) {
            this.$Message.success('修改部门成功')
            this.init()
          } else {
            this.$Message.error('修改部门失败')
          }
        })
      }
    },
    /**
    * @desc 删除部门
    */
    deleteDepartment: function () {
    },
    /**
    * @desc 新增用户
    */
    addUser: function () {
      if (this.pid === '') {
        this.$Message.warning('请先选择部门')
      } else {
        this.userObj = {}
        this.modalUserTitle = '新增用户'
        this.modalUser = true
      }
    },
    /**
    * @desc 修改用户
    * @param {Object} row 要修改的用户对象
    */
    editUser: function (row) {
      this.userObj = row.row
      delete this.userObj._index
      delete this.userObj.orwKey
      this.modalUserTitle = '修改用户'
      this.modalUser = true
    },
    /**
    * @desc 保存用户
    */
    saveUser: function () {
      if (this.userObj.id === undefined) {
        this.userObj.department_id = this.selectDepartmentObj.id
        this.userObj.registration_date = Util.getCurrentDate()
        let jsonStr = JSON.stringify(this.userObj)
        this.$api.post('/system/user/registe.do', {data: jsonStr}, r => {
          if (r.data.result) {
            this.$Message.success('新增用户成功')
            let u = r.data.describe.split(',')
            this.$api.post('/groups/asyncGroup', {}, r => {
              this.$api.post('/groups/asyncUserForInt', {id: u[0], name: u[1], positionId: u[2]}, r => {
                this.initUsersData()
              })
            })
          } else {
            this.$Message.error('新增用户失败')
          }
        })
      } else {
        let jsonStr = JSON.stringify(this.userObj)
        this.$api.post('/system/user/registe.do', {data: jsonStr}, r => {
          if (r.data.result) {
            this.$Message.success('修改用户成功')
            this.initUsersData()
          } else {
            this.$Message.error('修改用户失败')
          }
        })
      }
    },
    /**
    * @desc 删除用户
    * @param {Object} row 要删除的用户对象
    */
    deleteUser: function (row) {
    }
  },
  mounted () {
    this.init()
    this.$store.dispatch('setPositionList')
    this.$store.dispatch('setUserStatusList')
  }
}
</script>
