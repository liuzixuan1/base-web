import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  setTenantId,
  getTenantId
} from '@/libs/util'
import { saveErrorLogger } from '@/api/data'
import { listUserTenants } from '@/api/user'
import router from '@/router'
import {defaultRouters} from '@/router/routers'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    tenantName: '',
    tenantShortName: '',
    tenant_id: ''
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(rootState.router.allRouters || defaultRouters, rootState.user.access),
    errorCount: state => state.errorList.length
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList (state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal (state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError (state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus (state, status = true) {
      state.hasReadErrorPage = status
    },
    setTenantName(state,tenantPlayload) {
      if(tenantPlayload && tenantPlayload.tenantName) {
        state.tenantName = tenantPlayload.tenantName;
      }
      if(tenantPlayload && tenantPlayload.tenantShortName) {
        state.tenantShortName = tenantPlayload.tenantShortName;
      }
      localStorage.setItem('tenantName',state.tenantName);
      localStorage.setItem('tenantShortName',state.tenantShortName);
    },
    setTenantId(state,tenant_id) {
      if(tenant_id) {
        state.tenant_id = tenant_id;
      }
      setTenantId(state.tenant_id);
    }
  },
  actions: {
    addErrorLog ({ commit, rootState }, info) {
      if (!window.location.href.includes('error_logger_page')) commit('setHasReadErrorLoggerStatus', false)
      const { user: { token, userId, userName } } = rootState
      let data = {
        ...info,
        time: Date.parse(new Date()),
        token,
        userId,
        userName
      }
      saveErrorLogger(info).then(() => {
        commit('addError', data)
      })
    },

    setTenant ({ commit, rootState }, user_id) {
      listUserTenants(user_id).then((res) => {
        if(res.data.code.code == "0") {
          const data = res.data.result;
          if(!data || data.length < 1) {
            commit('setTenantId', '')
            commit('setTenantName', {tenantName:'',tenantShortName:''})
            return
          }
          let tenantId = getTenantId();   // 从localStorage中取tenantId
          let tenant_id = '';
          let tenantName= '';
          let tenantShortName = '';
          for(let item of data) {
            if(item.tenant_id == tenantId) {
              tenant_id = item.tenant_id;
              tenantName = item.tenant_name;
              tenantShortName = item.tenant_name.substring(0,1);
              break;
            }
          }
          //如果没匹配上的，则默认取列表第一个设置成用户的租户
          if(tenant_id == '') {
            tenant_id = data[0].tenant_id;
            tenantName = data[0].tenant_name;
            tenantShortName = data[0].tenant_name.substring(0,1)
          }
          commit('setTenantId', tenant_id);
          commit('setTenantName', {tenantName:tenantName,tenantShortName:tenantShortName});
        } else {
          commit('setTenantId', '')
          commit('setTenantName', {tenantName:'',tenantShortName:''})
        }
      })
    }
  }
}