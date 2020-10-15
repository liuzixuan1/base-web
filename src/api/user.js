import axios from '@/libs/api.request'
import config from '@/config/index.js'

export const login = ({ userName, password }) => {
  const data = {
    client_id: "web", // 1a2ee57ebb614aeba18d42693da942gv
    grant_type: "password", // authorization_code
    username: userName,
    password
  }
  return axios.request({
    url: config.serverName.oauthServer + 'oauth/token',
    data,
    method: 'post'
  })
}

export const refreshToken = (refresh_token) => {
  return axios.request({
    url: config.serverName.oauthServer + 'oauth/refreshToken',
    method: 'get',
    params: {refresh_token}
  })
}

export const getUserInfo = (tenantId) => {
  return axios.request({
    url: config.serverName.userServer + 'user/getUserInfo.json',
    method: 'get',
    params: {tenantId}
  })
}

/** 下载图片 */
export const downloadImage = (attach_id) => {
    return axios.request({
      url: config.serverName.fileServer + 'file/anon/downloadFile.json',
      method: 'get',
      responseType: "arraybuffer",
      params: {attach_id: attach_id}
    })
}

export const listUserTenants = (user_id) => {
  return axios.request({
    url: config.serverName.userServer + 'tenant/listByUserId.json',
    params: {user_id},
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: config.serverName.oauthServer + 'sso/ssoLogOut',
    method: 'get',
    params: {access_token: token}
  })
}
