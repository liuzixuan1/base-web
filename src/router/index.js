import Vue from 'vue'
import Router from 'vue-router'
import {defaultRouters,errorRouters,customRouters} from './routers'
import store from '@/store'
import iView from 'iview'
import { setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
let router = new Router({
  routes: defaultRouters
  // mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {  
  if(to.name == null) { //如果name为null ，则直接跳转到home页面
    next({
      name: homeName
    })
    return false;
  }
  iView.LoadingBar.start();
  next();
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
