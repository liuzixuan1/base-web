import {defaultRouters, errorRouters, customRouters} from '@/router/routers.js'
import router from '@/router/index.js'
import { updateRouteInMenus  } from '@/libs/util'
import config from '@/config'
const { menuAccessName,menuNoneAccessName } = config

function recursiveRouter(routers, menus) {
  for (let item of routers ) {
    if(updateRouteInMenus(item,menus)) {
      item.meta.access = menuAccessName;      
    } else {
      //如果是开发环境，并且菜单是设置的静态菜单属性为true, 则让有权限
      if(process.env.NODE_ENV === 'development' && item.meta.isDevStaticMenu ) {
        item.meta.access = menuAccessName;
      } else {
        item.meta.access = menuNoneAccessName;
      }
    }
    if(item.children && item.children.length > 0){
      recursiveRouter(item.children, menus);
    } else {

    }
  }
}

export default {
  state: {
    allRouters: '',
    customRouters,
    hasUpdateRoutes: false,  //是否已更新路由
    firstRouter: '', //默认路由
  },
  getters: {

  },
  mutations: {
    /** 根据后台返回的菜单信息 刷新路由权限 */
    updateRoutes (state, menus) {
      recursiveRouter(state.customRouters, menus);
      //路由合并，组成全路由对象
      let routers = defaultRouters.concat(state.customRouters);
      state.allRouters = routers.concat(errorRouters);
      router.addRoutes(state.customRouters);  //添加自定义菜单路由
      router.addRoutes(errorRouters); //自定义错误 路由，这个要放最后面
      state.hasUpdateRoutes = true  //设置成已更新路由信息
    }
  },
  actions: {

  }
}
