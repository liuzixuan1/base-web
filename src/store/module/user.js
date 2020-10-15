import {
  login,
  refreshToken,
  logout,
  getUserInfo,
  downloadImage
} from '@/api/user'
import { setToken, getToken, setRefreshToken, getRefreshToken,setUserId,setRealName} from '@/libs/util'
import config from '@/config'
const { menuAccessName } = config

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    menus: []
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
      setUserId(id);
    },
    setUserName (state, name) {
      state.userName = name
      setRealName(name);
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMenus (state, menus) {
      state.menus = menus
    }
  },
  getters: {

  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          const data = res.data.result;
          if(res.data.code.code == "0") {
            commit('setToken', data.access_token);
            setRefreshToken(data.refresh_token); //refresh token不需要进状态管理
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 刷新token获取token
    refreshToken ({ commit }) {
      return new Promise((resolve, reject) => {
        refreshToken(getRefreshToken()).then(res => {
          const data = res.data.result;
          if(res.data.code.code == "0") {
            commit('setToken', data.access_token);
            setRefreshToken(data.refresh_token); //refresh token不需要进状态管理
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(res => {
        //   console.log("logout success");
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   setRefreshToken('');
        //   resolve(res)
        // }).catch(err => {
        //   console.log("logout success");
        //   commit('setToken', '')
        //   commit('setAccess', [])
        //   setRefreshToken('');
        //   reject(err)
        // })

        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        localStorage.clear
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit, dispatch }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(config.tenantId).then(res => {
            const data = res.data.result;
            if(res.data.code.code == "0") {
              if(data.user.avatar == '' || data.user.avatar == null){
                commit('setAvatar', '')
              } else {
                downloadImage(data.user.avatar).then(ress => {
                  //图片数据
                  var byteImage = 'data:image/png;base64,'+btoa(new Uint8Array(ress.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                  commit('setAvatar',byteImage)
                });
              }
              commit('setUserName', data.user.real_name)
              commit('setUserId', data.user.user_id)
              commit('setAccess', menuAccessName)   //这里设置权限为slef, 调用updateRoutes后，会将和菜单匹配的路由全都设置权限 slef 用来控制菜单路由
              commit('setHasGetInfo', true)
              commit('setMenus', data.menus);
              commit('updateRoutes',data.menus,{root:true});  //更新后台加载的菜单到路由中去
              dispatch('setTenant', data.user.user_id); //根据用户id设置此用户的租户信息
            }
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
  }
}
