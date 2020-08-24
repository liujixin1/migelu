import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/admin/login',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/admin/getAdminInfo',
    method: 'post',
  })
}

export function logout() {
  return request({
    url: '/api/admin/logout',
    method: 'post'
  })
}
export function securityCode() {
  return request({
    url: '/api/admin/getCaptcha',
    method: 'get'
  })
}

export function personalEditAdminInfo(data) {
  return request({
      url: '/api/admin/personalEditAdminInfo',
      method: 'post',
      data
  })
}
//修改密码
export function personalEditAdminPassword(data) {
  return request({
      url: '/api/admin/personalEditAdminPassword',
      method: 'post',
      data
  })
}
//脚本状态
export function getHangQingTime(data) {
  return request({
      url: 'api/setting/getHangQingTime',
      method: 'post',
      data
  })
}