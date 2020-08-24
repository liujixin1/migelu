import request from '@/utils/request'

export function getSettingInfo(data) {
  return request({
    url: '/api/System/getSettingInfo',
    method: 'post',
    data
  })
}
export function saveSettingInfo(data) {
    return request({
      url: '/api/System/saveSettingInfo',
      method: 'post',
      data
    })
  }