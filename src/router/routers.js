import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * 路由列表由三部分组成，系统默认页面路由，菜单路由，404错误路由
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  isDevStaticMenu: (false) 是否是开发环境下的静态菜单，设置为true后，在开发环境下，是不会受后台的菜单权限控制显示与否，主要用于开发环境下，先前台开发，开发完成后再去后台配置菜单权限
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export const defaultRouters = [{
        path: '/',
        name: '_login',
        meta: { title: 'Login - 登录', hideInMenu: true },
        component: () =>
            import('@/view/login/login.vue')
    },
    {
        path: '/_home',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: { hideInMenu: true, notCache: true },
        children: [{
            path: '/home',
            name: 'home',
            meta: { hideInMenu: true, title: '首页', notCache: true, icon: 'md-home' },
            component: () =>
                import('@/view/single-page/home')
        }]
    },
    {
        path: '/message',
        name: 'message',
        component: Main,
        meta: { hideInBread: true, hideInMenu: true },
        children: [{
            path: 'message_page',
            name: 'message_page',
            meta: { icon: 'md-notifications', title: '消息中心' },
            component: () =>
                import('@/view/single-page/message/index.vue')
        }]
    },
    {
        path: '/error_logger',
        name: 'error_logger',
        meta: { hideInBread: true, hideInMenu: true },
        component: Main,
        children: [{
            path: 'error_logger_page',
            name: 'error_logger_page',
            meta: { icon: 'ios-bug', title: '错误收集' },
            component: () =>
                import('@/view/single-page/error-logger.vue')
        }]
    },
    {
        path: '/401',
        name: 'error_401',
        meta: { hideInMenu: true },
        component: () =>
            import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: { hideInMenu: true },
        component: () =>
            import('@/view/error-page/500.vue')
    },
    {
        path: '/shop',
        name: 'shop',
        meta: { title: '管理员', icon: 'iconfont icon-niheshujujihe', isDevStaticMenu: true},
        component: Main,
        children:[{
            path: '/shop_mng',
            name: 'shop_mng',
            meta: { title: '物品管理', icon: 'iconfont icon-niheshujujihe', isDevStaticMenu: true },
            component: parentView,
            children: [{
                path: '/shoplist',
                name: 'shoplist',
               
                meta: { title: '物品列表', icon: 'iconfont icon-jihezhuangtai', isDevStaticMenu: true },
                component: () =>
                    import('@/view/xb/admin/card/cardlist.vue')
            }]
        },
        {
            path: '/info_mng',
            name: 'info_mng',
            meta: { title: '信息管理', icon: 'iconfont icon-niheshujujihe', isDevStaticMenu: true },
            component: parentView,
            children: [{
                path: '/userlist',
                name: 'userlist',
                meta: { title: '用户管理', icon: 'iconfont icon-jihezhuangtai', isDevStaticMenu: true },
                component: () =>
                    import('@/view/xb/admin/user/userlist.vue')
            },
            {
                path: '/ratiolist',
                name: 'ratiolist',
                meta: { title: '结算比例管理', icon: 'iconfont icon-jihezhuangtai', isDevStaticMenu: true,hideInMenu: true },
                component: () =>
                    import('@/view/xb/admin/ratio/ratiolist.vue')
            }
        ]
        }
   ]
    },
    {
        path: '/template',
        name: 'template',
        access: 1,
        meta: { title: '用户', icon: 'iconfont icon-niheshujujihe',hideInBread: true, isDevStaticMenu: true,hideInMenu: true },
        component: Main,
        children:[{
            path: '/ucardlist1_page',
            name: 'ucardlist1_page',
            meta: { title: '商家物品显示', icon: 'iconfont icon-niheshujujihe', isDevStaticMenu: true },
            component: () =>
                import('@/view/xb/user/ucardlist1.vue')            
        },
        {
            path: '/ucardlist2_page',
            name: 'ucardlist2_page',
            meta: { title: '待结算物品', icon: 'iconfont icon-niheshujujihe', isDevStaticMenu: true },
            component: () =>
                import('@/view/xb/user/ucardlist2.vue')            
        },
        {
            path: '/userInfo_page',
            name: 'userInfo_page',
            meta: { title: '我的信息', icon: 'iconfont icon-niheshujujihe', isDevStaticMenu: true },
            component: () =>
                import('@/view/xb/user/userInfo/userlist.vue')            
        }
    ]
    }
]

export const errorRouters = [{
    path: '*',
    name: 'error_404',
    meta: { hideInMenu: true },
    component: () =>
        import('@/view/error-page/404.vue')
}]

export const customRouters = []