import request from '@/utils/request'
export function getRightGroupList(data) {
  return request({
    url: '/api/Rightgroup/getRightGroupList',
    method: 'post',
    data
  })
}
export function addRightGroup(data) {
  return request({
    url: '/api/Rightgroup/addRightGroup',
    method: 'post',
    data
  })
}
export function editRightGroup(data) {
  return request({
    url: '/api/Rightgroup/editRightGroup',
    method: 'post',
    data
  })
}
export function getRightGroupInfo(data) {
  return request({
    url: '/api/Rightgroup/getRightGroupInfo',
    method: 'post',
    data
  })
}
export function delRightGroup(data) {
  return request({
    url: '/api/Rightgroup/delRightGroup',
    method: 'post',
    data
  })
}