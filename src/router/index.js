import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import {routers} from './router'
import Util from '@/utils/index'

Vue.use(Router)

// 路由配置
const RouterConfig = {
  routes: routers
}

export const router = new Router(RouterConfig)

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (Util.isEmpty(localStorage.userName) && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
    next({
      name: 'login'
    })
  } else if (!Util.isEmpty(localStorage.userName) && to.name === 'login') { // 判断是否已经登录且前往的是登录页
    next({
      name: 'home'
    })
  } else { // 没有配置权限的路由, 直接通过
    next()
  }
})

router.afterEach((to) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
