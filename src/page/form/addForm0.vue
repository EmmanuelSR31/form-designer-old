<template>
<div>
  <Row>
    <Col span="12">
      <Form :label-width="120">
        <draggable class="createForm-con" id="createFormCon" v-model="formControls" :move="onMove" @end="leftDragEnd" :options="dragToOptions">
          <FormItem v-for="(item, index) in formControls" :key="index" :label="item.title">
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
       </draggable>
     </Form>
    </Col>
    <Col span="10" offset="2">
      <div class="controls-con">
        <Form :label-width="120">
          <draggable id="controlsCon" v-model="controlArray" :move="onMove" :options="dragOptions">
            <transition-group>
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
            </transition-group>
          </draggable>
        </Form>
      </div>
    </Col>
  </Row>
</div>
</template>
<script>
import draggable from 'vuedraggable'
export default {
  components: {
    draggable
  },
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
    dragEnd: function (evt) {
      console.log(evt.item)
      // this.formControls.push('' + evt.item.innerHTML + '')
      console.log(this.formControls)
    },
    onMove: function ({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    leftDragEnd: function (event) {
      console.log(event)
    }
  },
  computed: {
    dragOptions () {
      return {
        group: {
          name: 'control',
          pull: 'clone'
        }
      }
    },
    dragToOptions () {
      return {
        group: 'control',
        containment: 'parent',
        scroll: true
      }
    }
  }
}
</script>
<style>
</style>
