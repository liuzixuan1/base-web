import axios from 'axios'
import store from '@/store'
import { getToken,getRefreshToken } from '@/libs/util'
import { Notice } from 'iview'
import configUrl from '@/config'

Notice.config({
  top: 60,
  duration: 4
});
const REFRESH_TOKEN_URL = "oauth/refreshToken"; //刷新tokenURL
const LOGOUT_URL = "oauth/logout"; //退出URL

// import { Spin } from 'iview'
const addErrorLog = errorInfo => {
  const { statusText, status, request: { responseURL } } = errorInfo
  let info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor (baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      timeout:0,
      headers: {
        //
      }
    }
    return config
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors (instance, options) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      //认证请求头中添加token
      config.headers.Authorization = 'Bearer ' + getToken();
      if(options.url.indexOf(REFRESH_TOKEN_URL) >= 0) { //如果请求的刷新token，则认证头里加载刷新token，同时打上特殊标识
        config.headers.Authorization = 'Bearer ' + getRefreshToken();
      }

      this.queue[options.url] = true
      return config
    }, error => {
      //请求错误提醒
      Notice.error({title: "网络请求失败，请稍后再试"})
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(options.url)
      const { data, status } = res
      if(res.data && res.data.code) {
        if(res.data.code.code != 0&&!options.toast) {  //如果不等于0，则表示操作失败
          Notice.error({
            title: res.data.code.msg,
            desc: 'code [ '+res.data.code.code+' ]'
          })
        } else if(res.data.code.code === '0') { //操作成功
          // if(options.toast) { //如果需要显示提示成功
          //   Notice.success({
          //     title: res.data.code.msg
          //   })
          // }
        }
      }
      return { data, status }
    }, error => {
      this.destroy(options.url)
      let errorInfo = error.response
      if (!errorInfo) {
        const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
        errorInfo = {
          statusText,
          status,
          request: { responseURL: config.url }
        }
      }
      // addErrorLog(errorInfo);
      let response = error.response
      let config = response.config
      if(response.status === 401) {
        if(config.url.indexOf(LOGOUT_URL) >= 0) { //如果是退出接口无权限，则直接返回
          return response
        }
        if(response.data == "token expired" && config.url.indexOf(REFRESH_TOKEN_URL) < 0) {  //如果token过期，需要先用刷新token请求token，再重放上次请求
          response = store.dispatch('refreshToken').then(() =>{
            config.baseURL=''
            config.headers.Authorization = 'Bearer ' + getToken()
            return this.request(config);
          }).catch((error) =>{
              store.dispatch('handleLogOut').then(() => {
              //window.location.reload(true)// In order to re-instantiate the vue-router object to avoid bugs
              window.location.href = configUrl.serverName.ssoLogin;
            })
          })
        } else if(response.data === "permission denied") {  //无权限
          //判断是开发环境，提示信息还带上当前无权限的url
          if(process.env.NODE_ENV === 'development'){
            Notice.error({title: "无接口访问权限" ,desc: 'URL: ' + response.config.url})
          } else {
            Notice.error({title: "无接口访问权限"})
          }
        } else if(response.data === "not login") {
          Notice.error({title: "你的账号已在别处退出，请重新登录"})
        } else { //其他状态的请求全部重定向到登录页
            store.dispatch('handleLogOut').then(() => {
            //window.location.reload(true)// In order to re-instantiate the vue-router object to avoid bugs
            window.location.href = configUrl.serverName.ssoLogin;
          })
        }
        return response
      } else {
        //请求错误提醒
        Notice.error({title: "网络请求失败，请稍后再试"})
      }

      return Promise.reject(error)
    })
  }
  request (options) {
    if(options.url) {
      const instance = axios.create()
      options = Object.assign(this.getInsideConfig(), options)
      this.interceptors(instance, options)
      return instance(options)
    } else {
      //请求错误提醒
      Notice.error({
        title: "请求参数不合法，未设置请求地址！！"
      })
    }
  }
}
export default HttpRequest
