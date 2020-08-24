import request from '@/utils/request'

export function userList(data) {
  return request({
    url: '/api/users/index',
    method: 'post',
    data
  })
}
export function changeType(data) {
  return request({
    url: 'api/users/changeType',
    method: 'post',
    data
  })
}
export function addUser(data) {
  return request({
    url: 'api/users/store',
    method: 'post',
    data
  })
}