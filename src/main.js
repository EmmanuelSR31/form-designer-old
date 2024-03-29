// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import App from './App'
import {router} from './router/index'
import api from './api/index.js'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// import Vuetable from 'vuetable-2'
import layer from 'vue-layer'
/* import 'vue-easytable/libs/themes-base/index.css'
import {VTable, VPagination} from 'vue-easytable'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Multiselect from 'vue-multiselect' */
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// import ECharts from 'vue-echarts/components/ECharts.vue'
// import VueCharts from 'vue-chartjs'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.use(iView)
Vue.use(VueAwesomeSwiper)
/* Vue.use(Vuetable)
Vue.component('vuetable', Vuetable) */

Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.config.devtools = true

Vue.prototype.$layer = layer(Vue)

/* Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

Vue.component('multiselect', Multiselect) */

Vue.use(VueCodemirror)

Vue.component('vue-draggable-resizable', VueDraggableResizable)

// Vue.component('chart', ECharts)

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
console.log(vm)
