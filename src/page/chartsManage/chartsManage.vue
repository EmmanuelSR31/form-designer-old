<template>
<div>
  <Row>
    <Col span="4">
      <div class="edit-chart-left-con">
        <div class="edit-chart-left-title">表单</div>
        <Select v-model="currentForm" @on-change="changeForm">
          <Option v-for="(item, index) in formList" :value="item" :key="index">{{ item.name }}</Option>
        </Select>
        <div class="edit-chart-left-line"></div>
        <div class="edit-chart-left-title">字段</div>
        <ul class="edit-chart-left-list">
        <draggable v-model="fields" :options="dragOption" @end="dragEnd">
          <li v-for="(item, index) in fields" :key="index">{{item.title}}</li>
        </draggable>
        </ul>
      </div>
    </Col>
    <Col span="16" class="edit-chart-middle">
      <div class="edit-chart-field-con">
        <label>维度：</label>
        <div class="edit-chart-field-inner">
          <ul>
            <draggable v-model="x_field" :options="dragToXOption">
              <li v-for="(item, index) in x_field" :key="index">
                <Dropdown trigger="click" placement="bottom-start">
                  <Button type="primary">
                    <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
                    <template v-else>{{item.title}}</template>
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <DropdownItem><a href="javascript:void(0)" @click="setFieldName(item)">设置字段</a></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </draggable>
          </ul>
        </div>
      </div>
      <div class="edit-chart-field-con">
        <label>数值：</label>
        <div class="edit-chart-field-inner">
          <ul>
            <draggable v-model="y_field" :options="dragToYOption" class="drag-y-con">
              <li v-for="(item, index) in y_field" :key="index">
                <Dropdown trigger="click" placement="bottom-start">
                  <Button type="primary">
                    <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
                    <template v-else>{{item.title}}</template>
                    {{fieldCalculateTypeFormat(item)}}
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <DropdownItem v-for="(itm, index) in chartFieldCalculateType" :key="index">
                      <a href="javascript:void(0)" :class="{'selected': item.calculateType === itm.value}" @click="setFieldCalculateType(item, itm.value)">{{itm.text}}</a>
                    </DropdownItem>
                    <DropdownItem divided><a href="javascript:void(0)" @click="setFieldName(item)">设置字段</a></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </li>
            </draggable>
          </ul>
        </div>
      </div>
      <div>
        <div class="chart-condition-con">
          <div class="chart-condition-title">筛选器</div>
          <draggable v-model="conditions" :options="dragToCOption" @add="conditionDragEnd" class="chart-condition-list">
            <Collapse v-for="(item, index) in conditions" :key="index">
              <Panel>
                {{item.title}}
                <a href="javascript:void(0)" @click.stop="delCondition(index)" title="删除" class="chart-condition-li-del"><Icon type="md-close" /></a>
                <a href="javascript:void(0)" @click.stop="setCondition(item)" title="编辑"><Icon type="ios-settings" /></a>
                <p slot="content">
                  <template v-if="item.type === 'exact' && item.options.length > 0">
                    <ul>
                      <li v-if="item.rangeType === '1'">包含下列选项</li>
                      <li v-if="item.rangeType === '0'">不包含下列选项</li>
                      <li v-for="(itm, i) in item.options" :key="i">{{itm.text}}</li>
                    </ul>
                  </template>
                  <template v-else-if="item.type === 'condition' && item.conditions.length > 0">
                    <ul>
                      <li v-if="item.condition_type === '0'">满足任一条件</li>
                      <li v-if="item.condition_type === '1'">满足所有条件</li>
                      <li v-for="(itm, i) in item.conditions" :key="i">
                        {{chartConditionFormat(itm.operator)}}&nbsp;&nbsp;{{itm.content}}
                      </li>
                    </ul>
                  </template>
                </p>
              </Panel>
            </Collapse>
          </draggable>
          <div class="chart-condition-title">颜色</div>
          <ul class="series-color-list">
            <li v-for="(item, index) in y_field" @click="showColorTheme" :key="index">
              <i :style="{'background': item.color}"></i>
              <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
              <template v-else>{{item.title}}</template>
              {{fieldCalculateTypeFormat(item)}}
            </li>
          </ul>
        </div>
        <div class="chart-con">
          <div class="chart-search-condition-con">
            <ul>
              <li v-for="(item, index) in searchConditions" :key="index">
                <label>
                  <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
                  <template v-else>{{item.title}}</template>
                </label>{{item.value}}
                <template v-if="item.fieldType === 'combobox'">
                  <Select v-model="item.value" style="width:120px;">
                    <Option v-for="(itm, index) in selectData[item.selectID]" :value="itm.value" :key="index">{{itm.text}}</Option>
                  </Select>
                </template>
                <template v-else>
                  <span>{{chartConditionFormat(item.operator)}}</span>
                  <template v-if="['datebox', 'datetimebox', 'monthbox', 'yearbox'].indexOf(item.fieldType) !== -1">

                  </template>
                  <template v-else>
                    <Input v-model="item.value" style="width:120px;"></Input>
                  </template>
                </template>
              </li>
              <li class="clear"></li>
            </ul>
          </div>
          <div id="main" style="height:400px;"></div>
        </div>
      </div>
    </Col>
    <Col span="4" class="chart-set-con">
      <Form :model="chartObj" :label-width="60">
        <div class="chart-set-title">图表标题</div>
        <Input v-model="chartObj.title"></Input>
        <div class="line"></div>
        <div class="chart-set-title">图表类型</div>
        <ul class="chart-type-list">
          <li v-for="(item, index) in chartType" :key="index">
            <a href="javascript:void(0)" :class="{'active': enableChartType.indexOf(item.type) !== -1, 'selected': item.type === chartObj.type}" @click="setChartType(item.type)" :title="item.title">
              <i :class="['chart-type-icon', item.icon]"></i>
            </a>
          </li>
        </ul>
      </Form>
      <div class="line"></div>
      <div class="chart-set-title">图内筛选器<a href="javascript:void(0)" @click="editSearchCondition"><Icon type="ios-settings" /></a></div>
      <ul>
        <li v-for="(item, index) in searchConditions" :key="index">
          <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
          <template v-else>{{item.title}}</template>
        </li>
      </ul>
      <div class="line"></div>
      <!-- 仪表盘配置 -->
      <Form v-show="['gauge'].indexOf(chartObj.type) !== -1" :model="chartObj" :label-width="100">
        <div class="chart-set-title">表盘配置</div>
        <FormItem label="标题">
          <Input v-model="chartObj.gauge.title"></Input>
        </FormItem>
        <FormItem label="目标值">
          <InputNumber :min="0" v-model="chartObj.gauge.max"></InputNumber>
        </FormItem>
        <FormItem label="目标值单位">
          <Select v-model="chartObj.gauge.unit" style="width:80px;">
            <Option value="1">无</Option>
            <Option value="10000">万</Option>
            <Option value="100000000">亿</Option>
            <Option value="1000">k</Option>
            <Option value="1000000">M</Option>
            <Option value="1000000000">G</Option>
          </Select>
        </FormItem>
        <FormItem label="百分比小数位数">
          <InputNumber :min="0" v-model="chartObj.gauge.rateDigit"></InputNumber>
        </FormItem>
      </Form>
      <Form :model="chartObj" :label-width="60">
        <!-- 功能配置 -->
        <div class="chart-set-title">功能配置</div>
        <template v-show="['gauge'].indexOf(chartObj.type) !== -1">
          <FormItem label="条件格式">
            <a href="javascript:void(0)" @click="showGaugeCondition"><Icon type="ios-settings" /></a>
          </FormItem>
        </template>
        <template v-show="['line', 'bar'].indexOf(chartObj.type) !== -1">
          <!-- X轴配置 -->
          <div class="chart-set-title">坐标X轴</div>
          <Checkbox v-model="chartObj.x.show">显示坐标轴</Checkbox><br>
          <Checkbox v-model="chartObj.x.showLabels">显示标签</Checkbox>
          <FormItem label="文字方向">
            <Select v-model="chartObj.x.rotation">
              <Option value="0">默认</Option>
              <Option value="90">竖向</Option>
              <Option value="315">左倾斜45</Option>
              <Option value="45">右倾斜45</Option>
            </Select>
          </FormItem>
          <Checkbox v-model="chartObj.x.showAll">强制显示所有标签</Checkbox>
          <div class="line"></div>
          <!-- Y轴配置 -->
          <div class="chart-set-title">坐标y轴</div>
          <Checkbox v-model="chartObj.y.show">显示坐标轴</Checkbox><br>
          <Checkbox v-model="chartObj.y.showLabels">显示标签</Checkbox>
          <FormItem label="标题">
            <Input v-model="chartObj.y.title"></Input>
          </FormItem>
          <FormItem label="单位">
            <Input v-model="chartObj.y.unit"></Input>
          </FormItem>
          <Checkbox v-model="chartObj.y.showTitle">显示标题和单位</Checkbox>
        </template>
        <div class="line"></div>
        <!-- 图表样式 -->
        <div class="chart-set-title">图表样式</div>
        <Checkbox v-model="chartObj.showDatalabels">显示图表标签</Checkbox>
        <FormItem label="线条样式" v-show="['line'].indexOf(chartObj.type) !== -1">
          <RadioGroup v-model="chartObj.lineStyle">
            <Radio label="straight"><span>直线</span></Radio>
            <Radio label="curve"><span>曲线</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="饼图样式" v-show="['pie'].indexOf(chartObj.type) !== -1">
          <RadioGroup v-model="chartObj.pieStyle">
            <Radio label="pieShape"><span>饼状</span></Radio>
            <Radio label="donutShape"><span>环形</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="图例设置" v-show="['pie'].indexOf(chartObj.type) !== -1">
          <Select v-model="chartObj.legend.position">
            <Option value="null">无图例</Option>
            <Option value="right">右侧图例</Option>
            <Option value="bottom">底部图例</Option>
            <Option value="top">头部图例</Option>
          </Select>
        </FormItem>
      </Form>
    </Col>
  </Row>
  <!-- 设置字段 -->
  <Modal v-model="modalFieldName" title="设置字段" @on-ok="saveFieldName">
    <div class="modal-field-con">
      <div>
        <Form ref="formFieldName" :model="currentField" :label-width="120">
          <FormItem label="字段别名" class="whole-line-703">
            <Input v-model="currentField.alias"></Input>
          </FormItem>
          <FormItem label="字段描述" class="whole-line-703">
            <Input v-model="currentField.describe"></Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </Modal>
  <!-- 编辑筛选项 -->
  <Modal v-model="modalCondition" title="编辑筛选项" @on-ok="saveCondition">
    <div class="modal-condition-con">
      <Form :model="currentCondition" :label-width="120">
        <RadioGroup v-model="currentCondition.type">
          <Radio v-show="['combobox'].indexOf(currentCondition.fieldType) !== -1" label="exact"><span>精确筛选</span></Radio>
          <Radio v-show="['datebox', 'datetimebox', 'monthbox', 'yearbox'].indexOf(currentCondition.fieldType) === -1" label="condition"><span>条件筛选</span></Radio>
          <Radio v-show="['datebox', 'datetimebox', 'monthbox', 'yearbox'].indexOf(currentCondition.fieldType) !== -1" label="date"><span>日期筛选</span></Radio>
        </RadioGroup>
        <!-- 精确筛选 -->
        <Card v-show="currentCondition.type === 'exact'">
          <Row>
            <Col span="12">
              <div class="modal-condition-title">{{currentCondition.title}}</div>
              <ul class="modal-condition-options">
                <li v-for="(item, index) in selectData[currentCondition.selectID]" :key="index">
                  {{item.text}}<a href="javascript:void(0)" @click="exactAdd(item)">添加</a>
                </li>
              </ul>
              <div class="modal-condition-options-all"><a href="javascript:void(0)" @click="exactAddAll">全部添加</a></div>
            </Col>
            <Col span="12">
              <Select v-model="currentCondition.rangeType">
                <Option value="1">包含下列选项</Option>
                <Option value="0">不包含下列选项</Option>
              </Select>
              <div v-show="currentCondition.options.length === 0" class="modal-condition-tips">请从左侧列表选择添加</div>
              <ul v-show="currentCondition.options.length > 0" class="modal-condition-options">
                <li v-for="(item, index) in currentCondition.options" :key="index">
                  {{item.text}}<a href="javascript:void(0)" @click="exactDel(item)">删除</a>
                </li>
              </ul>
              <div v-show="currentCondition.options.length > 0" class="modal-condition-options-all">
                <a href="javascript:void(0)" @click="exactClear">清空</a>
              </div>
            </Col>
          </Row>
        </Card>
        <!-- 条件筛选 -->
        <Card v-show="currentCondition.type === 'condition'">
          <Row>
            <Col span="24">
              <div class="modal-condition-title">筛选条件</div>
              <div class="modal-condition-condition">
                <Select v-show="currentCondition.conditions.length > 1" v-model="currentCondition.condition_type" style="width:140px;">
                  <Option value="0">满足任一条件</Option>
                  <Option value="1">满足所有条件</Option>
                </Select>
                <div v-for="(item, index) in currentCondition.conditions" :key="index">
                  <span>{{currentCondition.title}}</span>
                  <Select v-model="item.operator" style="width:100px;">
                    <Option :value="item.value" v-for="(item, index) in chartCondition" :key="index">{{item.text}}</Option>
                  </Select>
                  <Input v-model="item.content" style="width:160px;"></Input>
                  <template v-if="index === 0">
                    <a href="javascript:void(0)" @click="conditionAdd" title="增加条件"><Icon type="md-add" /></a>
                  </template>
                  <template v-else>
                    <a href="javascript:void(0)" @click="conditionDel(item)" title="删除该条件"><Icon type="md-remove" /></a>
                  </template>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        <!-- 日期筛选 -->
        <Row v-show="currentCondition.type === 'date'" class="modal-condition-date">
          <div class="modal-condition-title">{{currentCondition.title}}</div>
          <div class="line"></div>
          <Col span="8">
            <div class="modal-condition-title">筛选项<a href="javascript:void(0)" @click="addDateCondition"><Icon type="md-add" /></a></div>
            <ul class="modal-condition-options">
              <li v-for="(item, index) in currentCondition.dateCondition" :class="{'active': item === currentDateCondition}" @click="editDateCondition(item)" :key="index">
                {{item.name}}<a href="javascript:void(0)" v-if="index > 5" @click.stop="delDateCondition(index)">删除</a>
              </li>
            </ul>
          </Col>
          <Col span="16">
            <Card>
              <Form :model="currentDateCondition" :label-width="60">
                <FormItem label="筛选项">
                  <Input v-model="currentDateCondition.name" :disabled="currentDateCondition.disabled"></Input>
                </FormItem>
                <FormItem label="时间设置">
                  <Select v-model="currentDateCondition.type" :disabled="currentDateCondition.disabled" style="width:90px;">
                    <Option value="fixed">固定时长</Option>
                    <Option value="accurate">精确日期</Option>
                  </Select>
                </FormItem>
                <div class="line"></div>
                <div v-show="currentDateCondition.type === 'fixed'">
                  <FormItem label="最近">
                    <Input v-model="currentDateCondition.fixed.start" :disabled="currentDateCondition.disabled" style="width:90px;"></Input>
                    <Select v-model="currentDateCondition.fixed.granularity" :disabled="currentDateCondition.disabled" style="width:60px;">
                      <Option value="day">天</Option>
                      <Option value="week">周</Option>
                      <Option value="month">月</Option>
                      <Option value="quarter">季</Option>
                      <Option value="year">年</Option>
                    </Select>
                  </FormItem>
                  <FormItem label="截至">
                    <RadioGroup v-model="currentDateCondition.fixed.end">
                      <Radio label="1" :disabled="currentDateCondition.disabled">
                        <span v-show="currentDateCondition.fixed.granularity === 'day' || currentDateCondition.fixed.granularity === undefined">今天</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'week'">本周</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'month'">本月</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'quarter'">本季度</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'year'">今年</span>
                      </Radio>
                      <Radio label="0" :disabled="currentDateCondition.disabled">
                        <span v-show="currentDateCondition.fixed.granularity === 'day' || currentDateCondition.fixed.granularity === undefined">昨天</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'week'">上周</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'month'">上月</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'quarter'">上季度</span>
                        <span v-show="currentDateCondition.fixed.granularity === 'year'">去年</span>
                      </Radio>
                    </RadioGroup>
                  </FormItem>
                </div>
                <div v-show="currentDateCondition.type === 'accurate'">
                  <FormItem label="起始日期">
                    <DatePicker type="date" v-model="currentDateCondition.accurate.startDate" placement="top-start"></DatePicker>
                  </FormItem>
                  <FormItem label="截至日期">
                    <DatePicker type="date" v-model="currentDateCondition.accurate.endDate" placement="top-start"></DatePicker>
                  </FormItem>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  </Modal>
  <!-- 颜色设置 -->
  <Modal v-model="modalColorTheme" title="颜色设置" @on-ok="saveColorTheme">
    <div class="modal-field-con">
      <Card>
        <Row>
          <Col span="10">
            <div class="modal-condition-title">数值轴</div>
            <ul class="series-color-list">
              <li v-for="(item, index) in y_field" :class="{'active': currentColorThemeField === item}" @click="showFieldColorTheme(item)" :key="index">
                <i :style="{'background': item.color}"></i>
                <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
                <template v-else>{{item.title}}</template>
                {{fieldCalculateTypeFormat(item)}}
              </li>
            </ul>
          </Col>
          <Col span="14">
            &nbsp;&nbsp;&nbsp;&nbsp;配色方案
            <Select v-model="currentColorTheme" style="width:150px;">
              <Option v-for="(item, index) in chartColorTheme" :value="item" :key="index">{{item.name}}</Option>
            </Select>
            <ul class="modal-theme-colors">
              <li v-for="(item, index) in currentColorTheme.colors" :class="{'active': item === currentColorThemeField.color}" :style="{'background': item}" @click="setFieldColor(item)" :key="index">
                <Icon type="ios-checkmark" />
              </li>
              <div class="clear"></div>
            </ul>
            <div class="modal-condition-options-all">
              <ColorPicker v-model="currentColorThemeField.color" format="rgb" @on-change="saveColorChange" />自定义颜色
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  </Modal>
  <!-- 设置图内筛选器 -->
  <Modal v-model="modalSearchCondition" title="设置图内筛选器" width="650" @on-ok="saveSearchCondition">
    <div class="modal-field-con">
      <Card>
        <Row class="modal-search-condition-con">
          <Col span="8">
            <div class="modal-condition-title">字段</div>
            <ul class="modal-condition-options modal-condition-options-with-btn">
              <li v-for="(item, index) in fields" :title="item.title" :key="index">
                {{item.title}}<a href="javascript:void(0)" @click.stop="addSearchCondition(item)">添加</a>
              </li>
            </ul>
          </Col>
          <Col span="8">
            <div class="modal-condition-title">已添加</div>
            <ul class="modal-condition-options  modal-condition-options-with-btn">
              <li v-for="(item, index) in searchConditions" :class="{'active': item === currentSearchCondition}" @click="setCurrentSearchCondition(item)" :title="item.title" :key="index">
                <template v-if="item.alias !== '' && item.alias !== undefined">{{item.alias}}</template>
                <template v-else>{{item.title}}</template>
                <a href="javascript:void(0)" @click.stop="delSearchCondition(index)">删除</a>
              </li>
            </ul>
          </Col>
          <Col span="8">
            <div class="modal-condition-title">
              <template v-if="currentSearchCondition.fieldType === 'combobox'">选项</template>
              <template v-else>筛选条件</template>
            </div>
            <template v-if="currentSearchCondition.fieldType === 'combobox'">
              <ul class="modal-condition-options">
                <li v-for="(item, index) in selectData[currentSearchCondition.selectID]" :key="index">{{item.text}}</li>
              </ul>
            </template>
            <template v-else-if="currentSearchCondition.fieldType !== undefined">
              <Form :label-width="40">
                <FormItem label="别名">
                  <Input v-model="currentSearchCondition.alias" style="width:120px;"></Input>
                </FormItem>
                <FormItem label="条件">
                  <Select v-model="currentSearchCondition.operator" style="width:120px;">
                    <Option :value="item.value" v-for="(item, index) in chartCondition" :key="index">{{item.text}}</Option>
                  </Select>
                </FormItem>
              </Form>
            </template>
          </Col>
        </Row>
      </Card>
    </div>
  </Modal>
  <!-- 仪表盘条件配置 -->
  <Modal v-model="modalGaugeCondition" title="条件格式" @on-ok="saveGaugeCondition">
    <div class="modal-field-con">
      <div class="modal-condition-condition">
        <div v-if="chartObj.gauge.conditions.length === 0" class="modal-condition-tips">
          当前还没有设置条件 <Button type="button" @click="gaugeConditionAdd">点此添加</Button>
        </div>
        <draggable v-model="chartObj.gauge.conditions" :options="dragGaugeOption">
          <div v-for="(item, index) in chartObj.gauge.conditions" class="modal-gauge-condition" :key="index">
            <span>区间</span>
            <Input v-model="item.min" style="width:80px;"></Input> ~ 
            <Input v-model="item.max" style="width:80px;"></Input>
            <span>配色</span>
            <span class="select-color" @click="showGaugeConditionColor($event, item)"><span :style="{background: item.color}"></span></span>
            <template v-if="index === 0">
              <a href="javascript:void(0)" @click="gaugeConditionAdd" title="增加条件"><Icon type="md-add" /></a>
            </template>
            <a href="javascript:void(0)" @click="gaugeConditionDel(index)" title="删除该条件"><Icon type="md-remove" /></a>
          </div>
        </draggable>
      </div>
    </div>
  </Modal>
  <!-- 仪表盘条件颜色配置 -->
  <div v-show="modalGaugeConditionColor" class="gauge-condition-color-con" :style="{'top': modalGaugeConditionColorTop + 'px', 'left': modalGaugeConditionColorLeft + 'px'}">
    <ul>
      <li v-for="(item, index) in gaugeConditionsColors" @click="setCurrentGaugeConditionColor(item)" :key="index"><span :style="{background: item}"></span></li>
      <div class="clear"></div>
    </ul>
    <div class="line"></div>
    <div class="modal-condition-options-all">
      <ColorPicker v-model="currentGaugeCondition.color" format="rgb" />自定义颜色
    </div>
    <a class="gauge-condition-color-close" @click="closeCurrentGaugeConditionColor"><Icon type="md-close" /></a>
  </div>
</div>
</template>
<script>
import Util from '@/utils/index'
import draggable from 'vuedraggable'
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/toolbox')
require('es6-promise').polyfill()
export default {
  components: {
    draggable
  },
  data () {
    return {
      loading: false,
      formList: [], // 表单数据
      fields: [], // 表单字段
      chartObj: { // 图表对象
        title: '未命名图表',
        type: '',
        x: {show: true, rotation: '0', showAll: false, showLabels: true},
        y: {show: true, showLabels: true, showTitle: true},
        showDatalabels: false,
        lineStyle: 'straight',
        pieStyle: 'pieShape',
        legend: {
          position: 'null'
        },
        gauge: {'unit': '1', 'rateDigit': 2, 'conditions': []}
      },
      currentForm: {}, // 选中表单
      currentField: {},  // 选中字段
      modalFieldName: false,
      x_field: [], // 维度字段
      y_field: [], // 数值字段
      xData: [], // 维度数据
      yData: [], // 数值数据
      conditions: [], // 筛选条件
      option: {},
      charts: '',
      searchConditions: [], // 图内筛选器
      currentSearchCondition: [], // 当前图内筛选器
      modalCondition: false,
      currentCondition: {options: [], conditions: [], dateCondition: []}, // 编辑中的筛选条件
      selectData: this.$store.state.selectData, // 下拉数据
      chartFieldCalculateType: this.$store.state.chartFieldCalculateType, // 图表字段计算方式
      chartType: this.$store.state.chartType, // 图表类型
      chartCondition: this.$store.state.chartCondition, // 筛选条件
      chartDateCondition: this.$store.state.chartDateCondition, // 图表日期筛选项
      currentDateCondition: {fixed: {}, accurate: {}}, // 当前编辑的日期筛选项
      enableChartType: [], // 当前可选图表类型
      chartColorTheme: this.$store.state.chartColorTheme, // 图表配色
      currentColorTheme: {},  // 当前图表配色
      currentColorThemeField: {color: ''},  // 当前字段图表配色
      modalColorTheme: false,
      modalSearchCondition: false,
      modalGaugeCondition: false,
      modalGaugeConditionColor: false,
      currentGaugeCondition: {color: ''},  // 选中仪表盘配置
      modalGaugeConditionColorTop: 0,
      modalGaugeConditionColorLeft: 0,
      gaugeConditionsColors: this.$store.state.gaugeConditionsColors // 仪表盘配置颜色
    }
  },
  methods: {
    init: function () { // 取表单列表
      this.$api.post('/crm/ActionFormUtil/getAllTable.do', {}, r => {
        if (r.data) {
          this.formList = r.data.rows
        }
      })
      this.currentColorTheme = this.chartColorTheme[0]
    },
    changeForm: function () { // 选择表单
      let temp = JSON.parse(this.currentForm.str_json).field
      for (let i = 0; i < temp.length; i++) {
        if (['tablebox', 'filebox'].indexOf(temp[i].fieldType) === -1) {
          this.fields.push(temp[i])
        }
      }
      this.x_field = []
      this.y_field = []
      this.xData = []
      this.yData = []
      this.currentField = {}
      this.conditions = []
      this.searchConditions = []
      this.currentCondition = {options: [], conditions: [], dateCondition: []}
      this.currentDateCondition = {fixed: {}, accurate: {}}
      this.enableChartType = []
    },
    dragEnd: function (event) { // 拖拽结束
      if (event.to.className === 'drag-y-con') {
        this.setFieldCalculateType(this.y_field[this.y_field.length - 1], 'sum')
        this.y_field[this.y_field.length - 1].color = this.currentColorTheme.colors[this.y_field.length - 1]
      }
      console.log(this.y_field)
      if (event.to.className !== 'chart-condition-list') {
        this.changeEnableChartType()
        this.dataChange()
      }
    },
    changeEnableChartType: function () { // 刷新可选择图表类型
      if (this.x_field.length === 0 && this.y_field.length === 1) {
        this.enableChartType = ['gauge']
      } else if (this.x_field.length >= 1 && this.y_field.length >= 1) {
        this.enableChartType = ['line', 'bar', 'pie']
      }
    },
    setChartType: function (type) { // 设置图表类型
      this.chartObj.type = type
      if (type === 'gauge') {
        if (this.chartObj.gauge.conditions.length === 0) {
          this.chartObj.gauge.conditions = this.$store.state.gaugeConditions
        }
      }
    },
    setFieldName: function (item) { // 设置字段名称
      this.currentField = item
      this.modalFieldName = true
    },
    saveFieldName: function () { // 保存字段名称
      this.modalFieldName = false
    },
    setFieldCalculateType: function (item, calculateType) { // 设置字段计算方式
      this.$set(item, 'calculateType', calculateType)
    },
    fieldCalculateTypeFormat: function (item) { // 字段计算方式格式化
      for (let i = 0; i < this.chartFieldCalculateType.length; i++) {
        if (item.calculateType === this.chartFieldCalculateType[i].value) {
          return '(' + this.chartFieldCalculateType[i].text + ')'
        }
      }
    },
    conditionDragEnd: function (e) { // 拖拽增加筛选条件
      let index = this.conditions.length - 1
      this.conditions[index].type = 'exact'
      this.$set(this.conditions[index], 'options', [])
      this.$set(this.conditions[index], 'conditions', [{}])
      this.$set(this.conditions[index], 'rangeType', '1')
      this.$set(this.conditions[index], 'condition_type', '0')
      delete this.conditions[index].editable
      delete this.conditions[index].height
      delete this.conditions[index].listDisplay
      delete this.conditions[index].readonly
      delete this.conditions[index].required
      delete this.conditions[index].width
    },
    chartConditionFormat: function (value) { // 格式化筛选条件
      let temp = ''
      for (let i = 0; i < this.chartCondition.length; i++) {
        if (this.chartCondition[i].value === value) {
          temp = this.chartCondition[i].text
          break
        }
      }
      return temp
    },
    setCondition: function (item) { // 设置筛选条件
      this.currentCondition = item
      if (['combobox'].indexOf(this.currentCondition.fieldType) === -1) {
        this.currentCondition.type = 'condition'
      }
      if (['datebox', 'datetimebox', 'monthbox', 'yearbox'].indexOf(this.currentCondition.fieldType) !== -1) {
        this.currentCondition.type = 'date'
        if (this.currentCondition.dateCondition === undefined) {
          this.currentCondition.dateCondition = JSON.parse(JSON.stringify(this.chartDateCondition))
        }
        this.currentDateCondition = this.currentCondition.dateCondition[0]
      }
      this.modalCondition = true
    },
    delCondition: function (index) { // 删除筛选条件
      this.conditions.splice(index, 1)
    },
    saveCondition: function () { // 保存筛选条件
      this.modalCondition = false
    },
    exactAdd: function (item) { // 增加精确筛选选项
      if (this.currentCondition.options.indexOf(item) === -1) {
        this.currentCondition.options.push(item)
      }
    },
    exactAddAll: function () { // 全部增加精确筛选选项
      this.currentCondition.options = JSON.parse(JSON.stringify(this.selectData[this.currentCondition.selectID]))
    },
    exactDel: function (item) { // 删除精确筛选选项
      this.currentCondition.options.splice(this.currentCondition.options.indexOf(item), 1)
    },
    exactClear: function () { // 清空精确筛选选项
      this.currentCondition.options = []
    },
    conditionAdd: function () { // 增加条件筛选
      this.currentCondition.conditions.push({})
    },
    conditionDel: function (item) { // 删除条件筛选
      this.currentCondition.conditions.splice(this.currentCondition.conditions.indexOf(item), 1)
    },
    addDateCondition: function () { // 增加日期筛选项
      let temp = {name: '未命名', fixed: {}, relative: {}, accurate: {}}
      this.currentCondition.dateCondition.push(temp)
      this.currentDateCondition = temp
    },
    editDateCondition: function (item) { // 编辑日期筛选项
      this.currentDateCondition = item
    },
    delDateCondition: function (index) { // 删除日期筛选项
      if (this.currentDateCondition === this.currentCondition.dateCondition[index]) {
        this.currentDateCondition = this.currentCondition.dateCondition[0]
      } else {
        let temp = this.currentDateCondition
        this.currentDateCondition = {}
        this.currentDateCondition = temp
      }
      this.currentCondition.dateCondition.splice(index, 1)
    },
    showColorTheme: function () { // 编辑图表配色
      this.currentColorThemeField = this.y_field[0]
      this.modalColorTheme = true
    },
    saveColorTheme: function () { // 保存图表配色
      this.modalColorTheme = false
    },
    showFieldColorTheme: function (item) { // 显示字段图表配色
      this.currentColorThemeField = item
    },
    setFieldColor: function (color) { // 设置字段图表配色
      let temp = this.currentColorThemeField
      let i = this.y_field.indexOf(this.currentColorThemeField)
      this.currentColorThemeField = {}
      this.currentColorThemeField = temp
      this.y_field[i].color = ''
      this.$set(this.y_field[i], 'color', color)
    },
    saveColorChange: function (color) { // 显示自定义颜色
      this.currentColorThemeField.color = color
      let temp = this.currentColorThemeField
      let i = this.y_field.indexOf(this.currentColorThemeField)
      this.currentColorThemeField = {}
      this.currentColorThemeField = temp
      this.y_field[i].color = ''
      this.$set(this.y_field[i], 'color', color)
    },
    editSearchCondition: function () { // 编辑图内筛选器
      this.modalSearchCondition = true
    },
    saveSearchCondition: function () { // 保存图内筛选器
      this.modalSearchCondition = false
    },
    addSearchCondition: function (item) { // 增加图内筛选器
      this.searchConditions.push(item)
    },
    setCurrentSearchCondition: function (item) { // 设置当前图内筛选器
      this.currentSearchCondition = item
    },
    delSearchCondition: function (index) { // 删除图内筛选器
      if (this.searchConditions.length === 1) {
        this.currentSearchCondition = {}
      } else {
        if (this.currentSearchCondition === this.searchConditions[index]) {
          this.currentSearchCondition = this.searchConditions[0]
        } else {
          let temp = this.currentSearchCondition
          this.currentSearchCondition = {}
          this.currentSearchCondition = temp
        }
      }
      this.searchConditions.splice(index, 1)
    },
    showGaugeCondition: function () { // 显示仪表盘条件配置
      this.modalGaugeCondition = true
    },
    saveGaugeCondition: function () { // 保存仪表盘条件配置
      this.modalGaugeCondition = false
    },
    gaugeConditionAdd: function () { // 增加一条仪表盘条件配置
      this.chartObj.gauge.conditions.push({min: '', max: '', color: 'rgb(145, 199, 174)'})
    },
    gaugeConditionDel: function (index) { // 删除一条仪表盘条件配置
      this.chartObj.gauge.conditions.splice(index, 1)
    },
    showGaugeConditionColor: function (event, item) { // 显示仪表盘条件颜色配置
      this.currentGaugeCondition = item
      this.modalGaugeConditionColorTop = event.clientY
      this.modalGaugeConditionColorLeft = event.clientX
      this.modalGaugeConditionColor = true
    },
    setCurrentGaugeConditionColor: function (color) { // 设置仪表盘条件颜色配置
      this.currentGaugeCondition.color = color
    },
    closeCurrentGaugeConditionColor: function () { // 关闭仪表盘条件颜色配置
      this.modalGaugeConditionColor = false
    },
    dataChange: function () { // 是否刷新图表
      if (this.x_field.length > 0 && this.y_field.length > 0 && !Util.isEmpty(this.currentForm.title)) {
        this.initChart()
      }
    },
    initChart: function () { // 取图表数据
      let temp = ''
      this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsDataBySearch.do', {formName: this.currentForm.title, field: this.x_field, condition: temp, create_user_id: '1010'}, r => {
        if (r.data.length > 0) {
          this.xData = r.data.split(',')
        }
        this.$api.post('/crm/ActionFormSelectUtil/Select/getChartsDataBySearch.do', {formName: this.currentForm.title, field: this.y_field, condition: temp, create_user_id: '1010'}, r => {
          if (r.data.length > 0) {
            this.yData = r.data.split(',')
          }
          this.createChart()
        })
      })
    },
    createChart: function () { // 生成图表
      this.charts = echarts.init(document.getElementById('main'))
      console.log(this.xData)
      console.log(this.yData)
      if (this.chartObj.type === 'line' || this.chartObj.type === 'bar') {
        this.option = {
          title: {
            text: this.chartObj.name,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              magicType: {
                type: ['line', 'bar']
              },
              restore: {show: true},
              saveAsImage: {show: true}
            },
            right: 25
          },
          xAxis: {
            type: 'category',
            boundaryGap: true,
            name: this.chartObj.name_x,
            nameLocation: 'center',
            nameGap: 20,
            data: this.xData
          },
          yAxis: {
            type: 'value',
            name: this.chartObj.name_y
          },
          series: [
            {
              name: this.chartObj.name_y,
              type: this.chartObj.type,
              data: this.yData
            }
          ]
        }
      }
      this.charts.setOption(this.option)
    }
  },
  computed: {
    dragOption () {
      return {
        group: {
          name: 'fields',
          pull: 'clone'
        },
        sort: false
      }
    },
    dragToXOption () {
      return {
        group: {
          put: ['fields']
        }
      }
    },
    dragToYOption () {
      return {
        group: {
          put: ['fields']
        }
      }
    },
    dragToCOption () {
      return {
        group: {
          put: ['fields']
        }
      }
    },
    dragGaugeOption () {
      return {
        sort: true
      }
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    chartObj: function () {
      this.createChart()
    }
  }
}
</script>
<style lang="scss">
.edit-chart-left-con{
  padding: 10px;
  border-right: 1px solid #ddd;
}
.edit-chart-left-title{
  font-size: 0.13rem;
  font-weight: 600;
  line-height: 30px;
}
.edit-chart-left-line{
  height: 1px;
  background-color: #ddd;
  margin: 10px -10px;
}
.edit-chart-left-list{
  border-top: 1px solid #ddd;
  padding-left: 10px;
  li{
    line-height: 30px;
    cursor: move;
  }
}
.edit-chart-middle{
  padding: 10px;
}
.edit-chart-field-con{
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
  label{
    float: left;
    width: 60px;
    line-height: 34px;
  }
}
.edit-chart-field-inner{
  margin-left: 60px;
  ul{
    &>div{
      min-height: 34px;
    }
    &>div>li{
      float: left;
      height: 34px;
      line-height: 34px;
    }
  }
  .ivu-dropdown{
    margin-right: 10px;
  }
  a{
    color: #333;
    &.selected{
      color: #2d8cf0;
    }
  }
}
.chart-set-con{
  padding: 0.1rem;
  label.ivu-form-item-label{
    text-align: left;
  }
  .ivu-form-item{
    margin-bottom: 0;
  }
  label{
    margin-bottom: 5px;
  }
  .line{
    margin: 0.15rem 0 0.05rem 0;
  }
  .ivu-form-item-content, .chart-set-title{
    a{
      float: right;
      margin-right: 0.1rem;
      i{
        font-size: 0.18rem;
      }
    }
  }
}
.chart-set-title{
  padding: 10px 0;
  color: #515a6e;
  font-size: 12px;
  font-weight: 600;
}
.chart-type-list{
  display: inline-block;
  width: 100%;
  li{
    float: left;
    a{
      width: 40px;
      height: 40px;
      display: inline-block;
      padding: 4px;
      &.selected{
        box-shadow: 0 0 0 2px rgba(81,130,227,.06), inset 0 0 0 2px rgba(81,129,228,.6);
        background-color: #ffffff;
      }
    }
  }
}
.chart-type-icon{
  width: 32px;
  height: 32px;
  display: inline-block;
}
.chart-icon-line{
  background: url(../../assets/img/svg-sprite_d1903b5.svg) -1200px -1198px no-repeat;
}
.chart-icon-bar{
  background: url(../../assets/img/svg-sprite_d1903b5.svg) -800px -871px no-repeat;
}
.chart-icon-pie{
  background: url(../../assets/img/svg-sprite_d1903b5.svg) -1260px -1302px no-repeat;
}
.chart-icon-gauge{
  background: url(../../assets/img/svg-sprite_d1903b5.svg) -268px -1302px no-repeat;
}
.active, .chart-type-list li a.selected{
  .chart-icon-line{
    background: url(../../assets/img/svg-sprite_d1903b5.svg) -1092px -1238px no-repeat;
  }
  .chart-icon-bar{
    background: url(../../assets/img/svg-sprite_d1903b5.svg) -832px -871px no-repeat;
  }
  .chart-icon-pie{
    background: url(../../assets/img/svg-sprite_d1903b5.svg) -1156px -1238px no-repeat;
  }
  .chart-icon-gauge{
    background: url(../../assets/img/svg-sprite_d1903b5.svg) -300px -1302px no-repeat;
  }
}
.chart-condition-con{
  float: left;
  width: 160px;
  border-right: 1px solid #dddddd;
  padding-right: 10px;
}
.chart-condition-title{
  padding: 0.1rem 0;
}
.chart-condition-list{
  min-height: 200px;
  .ivu-collapse{
    margin-bottom: 5px;
  }
  .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header{
    height: 30px;
    line-height: 30px;
    padding-left: 8px;
    padding-right: 40px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    a{
      position: absolute;
      top: 0;
      right: 5px;
      &.chart-condition-li-del{
        right: 25px;
      }
      i{
        font-size: 15px;
      }
    }
  }
  .ivu-collapse>.ivu-collapse-item>.ivu-collapse-header>i{
    margin-right: 0;
  }
  li{
    padding: 5px 0;
  }
}
.ivu-card{
  font-size: 0.12rem;
}
.modal-condition-con{
  font-size: 0.12rem;
  .ivu-card{
    margin-top: 0.15rem;
  }
  .ivu-card-body{
    padding: 0;
  }
  .ivu-col{
    padding: 0.1rem;
  }
  .ivu-col:first-child{
    border-right: 1px solid #eeeeee;
  }
}
.modal-condition-title{
  padding: 0.08rem 0;
  font-size: 0.12rem;
  a{
    float: right;
    margin-right: 10px;
    i{
      font-size: 0.2rem;
    }
  }
}
.modal-condition-options{
  min-height: 180px;
  li{
    font-size: 0.12rem;
    padding: 0.06rem 10px 0.06rem 5px;
    &:hover{
      background-color: #f5f5f5;
      a{
        visibility: visible;
      }
    }
    &.active{
      background-color: #f5f5f5;
    }
    a{
      float: right;
      visibility: hidden;
    }
  }
}
.modal-condition-options-with-btn{
  li{
    padding-right: 30px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    a{
      float: none;
      position: absolute;
      right: 3px;
      top: 6px;
    }
  }
}
.modal-condition-options-all{
  text-align: center;
  a{
    font-size: 0.12rem;
  }
  i{
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    margin-right: 3px;
    vertical-align: middle;
  }
}
.modal-condition-tips{
  height: 180px;
  line-height: 180px;
  text-align: center;
  color: #999;
  font-size: 0.12rem;
}
.modal-condition-condition{
  font-size: 0.12rem;
  min-height: 201px;
  span{
    margin-right: 8px;
  }
  .ivu-select{
    margin-right: 8px;
  }
  a{
    margin-left: 30px;
  }
  i{
    font-size: 0.2rem;
  }
  &>div{
    margin-bottom: 5px;
  }
}
.modal-condition-date{
  .ivu-col{
    padding: 0;
  }
  .ivu-col:first-child{
    border-right: none;
  }
  .ivu-card{
    padding: 0.1rem 0.15rem;
    margin-top: 0.06rem;
  }
  .ivu-form-item{
    margin-bottom: 0.05rem;
  }
  .modal-condition-options li{
    cursor: pointer;
  }
  .line{
    margin: 0.2rem 0;
  }
}
.series-color-list{
  li{
    margin-bottom: 5px;
    font-size: 0.12rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    &.active{
      background-color: #f5f5f5;
    }
    i{
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
}
.modal-theme-colors{
  padding: 10px;
  li{
    float: left;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    text-align: center;
    margin: 0 6px 10px 6px;
    i{
      visibility: hidden;
      color: #ffffff;
      font-size: 32px;
    }
    &.active{
      box-shadow: 0 0 0 1px rgba(0,0,0,.06), 0 1px 2px 0 rgba(0,0,0,.2), inset 0 0 0 2px rgba(255,255,255,.6);
      i{
        visibility: visible;
      }
    }
  }
}
.ivu-color-picker-input{
  cursor: pointer;
}
.ivu-input-icon-normal+.ivu-input{
  padding-right: 0;
}
.ivu-color-picker-focused{
  border: none;
  box-shadow: none;
}
.ivu-color-picker-rel{
  i{
    display: none;
  }
}
.ivu-color-picker{
  .ivu-input{
    border: none;
  }
}
body .ivu-modal .ivu-color-picker .ivu-select-dropdown{
  top: -30px!important;
  left: 0px!important;
}
.ivu-color-picker-confirm{
  .ivu-btn-default{
    display: none;
  }
}
.modal-search-condition-con{
  .ivu-col{
    border-right: 1px solid #eeeeee;
    padding: 0 0.05rem;
    &:last-child{
      border-right: none;
    }
  }
  .modal-condition-options{
    height: 240px;
    overflow: auto;
  }
}
.chart-search-condition-con{
  &>ul{
    padding: 20px;
    &>li{
      float: left;
      margin: 10px;
    }
  }
}
.modal-gauge-condition{
  margin-bottom: 8px;
  cursor: move;
  span{
    display: inline-block;
    vertical-align: middle;
    margin: 0 10px;
  }
}
.select-color{
  display: inline-block;
  width: 44px;
  height: 32px;
  position: relative;
  cursor: pointer;
  span{
    display: inline-block;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 0;
  }
  &:after{
    right: 0;
    top: 14px;
    position: absolute;
    content: '';
    border-width: 4px;
    border-style: solid;
    border-color: #A3ABB0 rgba(0,0,0,0) rgba(0,0,0,0);
  }
}
.gauge-condition-color-con{
  position: fixed;
  width: 240px;
  padding: 20px;
  background-color: #ffffff;
  z-index: 2000;
  ul{
    li{
      float: left;
      margin: 0 8px 8px 0;
      cursor: pointer;
      span{
        display: inline-block;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        &:hover{
          box-shadow: 0 0 0 1px rgba(0,0,0,.06), 0 1px 2px 0 rgba(0,0,0,.2), inset 0 0 0 2px #FFF;
        }
      }
    }
  }
}
.gauge-condition-color-close{
  position: absolute;
  top: 5px;
  right: 8px;
  i{
    color: #999;
    font-size: 0.16rem;
  }
}
#main{
  float: left;
  margin-left: 160px;
}
</style>
