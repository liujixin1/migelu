import request from '@/utils/request'
export function SelectSetting(data) {
  return request({
    url: '/api/setting/selectSetting',
    method: 'post',
    data
  })
}

export function SaveSetting(data) {
    return request({
      url: '/api/setting/saveSetting',
      method: 'post',
      data
    })
  }