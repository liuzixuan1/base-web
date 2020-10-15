export default {
  /**
   * @description 微服务模块访问路径，用于网关调用下游服务
   */
  serverName: {
    userServer: "user-server/",
    oauthServer: "oauth-server/",
    goodsServer: "goods-server/",
    orderServer: "order-server/",
  },
  /**
   * @description api请求基础路径，如果是正式环境，需要加上/api来在nginx做路径匹配
   */
  baseUrl: {
    dev: '/',
    pro: '/gateway'
  },
  /**
   * @description 租户ID，每个业务系统的租户id由管理员下发
   */
  showTenantIcon: false, //是否显示当前租户信息图标，一般业务系统不需要显示，只有用户中心显示
  enterFirstMenu: false,  //是否进入默认的第一项菜单
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '后台管理系统',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description 默认打开的首页的路由name值，默认为home
   */
  homeName: 'home',
  /**
   * @description 菜单路由的权限值，这里为常量
   */
  menuAccessName: ['slef'],
   /**
   * @description 不在菜单里的路由的权限值，这里为常量
   */
  menuNoneAccessName: ['other'],
  /**
   * @description 需要加载的插件
   */
  plugin: {
    'error-store': {
      showInHeader: false, // 设为false后不会在顶部显示错误日志徽标
      developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
    }
  }
}