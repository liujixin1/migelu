import request from '@/utils/request'

export function permissionList(data) {
  return request({
    url: '/api/System/getRightList',
    method: 'post',
    data
  })
}
export function permissionGrouping(data) {
  return request({
    url: '/api/System/getRightGroups',
    method: 'post',
    data
  })
}
export function permissionGetControllers(data) {
  return request({
    url: '/api/System/getControllers',
    method: 'post',
    data
  })
}
export function permissionGetActions(data) {
  return request({
    url: '/api/System/getActions',
    method: 'post',
    data
  })
}
//提交
export function submit(data) {
  return request({
    url: '/api/System/editRight',
    method: 'post',
    data
  })
}
//删除
export function deletes(data) {
  return request({
    url: '/api/System/rightDel',
    method: 'post',
    data
  })
}
//获取信息
export function getRightInfo(data) {
  return request({
    url: '/api/System/getRightInfo',
    method: 'post',
    data
  })
}