import request from '@/utils/request'
export function roleList(data) {
  return request({
    url: '/api/Admin/getRoles',
    method: 'post',
    data
  })
}
export function getRoleInfo(data) {
    return request({
      url: '/api/Admin/getRoleInfo',
      method: 'post',
      data
    })
  }
  export function removeRole(data) {
    return request({
      url: '/api/Admin/roleDel',
      method: 'post',
      data
    })
  }
  export function addRole(data) {
    return request({
      url: '/api/Admin/addRole',
      method: 'post',
      data
    })
  }
  export function editRole(data) {
    return request({
      url: '/api/Admin/editRole',
      method: 'post',
      data
    })
  }