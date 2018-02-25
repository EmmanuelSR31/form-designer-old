<template>
<div>
  <Row>
    <Col span="12">
      <form class="ivu-form ivu-form-label-right">
        <div class="createForm-con" ref="createFormCon">
          <div v-for="(item, index) in formControls" :key="index">
          <FormItem :label="item.title">
            <template v-if="item.type === 'textInput'">
              <Input></Input>
              <Poptip>
                <a>click 激活</a>
                <div slot="title"><i>自定义标题</i></div>
                <div slot="content">
                  <a @click="close">关闭提示框</a>
                </div>
              </Poptip>
            </template>
            <template v-else-if="item.type === 'textarea'">
              <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </template>
            <template v-else-if="item.type === 'select'">
              <Select>
                <Option value="1">请选择</Option>
              </Select>
            </template>
            <template v-else-if="item.type === 'radio'">
              <Radio>单选框</Radio>
            </template>
            <template v-else-if="item.type === 'checkbox'">
              <Checkbox>多选框</Checkbox>
            </template>
          </FormItem>
          </div>
       </div>
     </form>
    </Col>
    <Col span="10" offset="2">
      <div class="controls-con">
        <Form :label-width="120">
          <div ref="controlsCon">
            <FormItem v-for="(item, index) in controlArray" :key="index" :label="item.title">
              <template v-if="item.type === 'textInput'">
                <Input></Input>
              </template>
              <template v-else-if="item.type === 'textarea'">
                <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
              </template>
              <template v-else-if="item.type === 'select'">
                <Select>
                  <Option value="1">请选择</Option>
                </Select>
              </template>
              <template v-else-if="item.type === 'radio'">
                <Radio>单选框</Radio>
              </template>
              <template v-else-if="item.type === 'checkbox'">
                <Checkbox>多选框</Checkbox>
              </template>
            </FormItem>
          </div>
        </Form>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
import Sortable from 'sortablejs'
export default {
  data () {
    return {
      controlArray: [
        {
          title: '文本输入框',
          type: 'textInput'
        },
        {
          title: '多行文本输入框',
          type: 'textarea'
        },
        {
          title: '下拉选择器',
          type: 'select'
        },
        {
          title: '单选框',
          type: 'radio'
        },
        {
          title: '多选框',
          type: 'checkbox'
        }
      ],
      formControls: []
    }
  },
  methods: {
    drag: function (ev) {
      console.log(ev)
    },
    showSet: function () {
      alert('11')
    }
  },
  mounted () {
    var el = this.$refs.controlsCon
    var toEl = this.$refs.createFormCon
    // let vm = this
    Sortable.create(el, {
      group: {
        name: 'controls',
        pull: 'clone'
      },
      onAdd: function (evt) {
        // console.log(evt)
      }
    })
    Sortable.create(toEl, {
      group: {
        name: 'controls',
        pull: false
      },
      containment: 'parent',
      onEnd: function (evt) {
        // console.log(evt)
      },
      onAdd: function (evt) {
        console.log(evt.item.innerHTML)
      }
    })
  }
}
</script>
<style>
</style>
