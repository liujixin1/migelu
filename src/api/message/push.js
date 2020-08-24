import request from '@/utils/request'
export function popupadv(data) {
  return request({
    url: 'api/popupadv/index',
    method: 'post',
    data
  })
}
export function selectUserIdStrShow(data) {
    return request({
      url: 'api/popupadv/selectUserIdStrShow',
      method: 'post',
      data
    })
  }
  export function destroy(data) {
    return request({
      url: 'api/popupadv/destroy',
      method: 'post',
      data
    })
  }
  export function uploadImg(data) {
    return request({
      url: 'api/Common/uploadImg',
      method: 'post',
      data
    })
  }
  export function searchUserItem(data) {
    return request({
      url: 'api/search_item/searchUserItem',
      method: 'post',
      data
    })
  }
  export function store(data) {
    return request({
      url: 'api/popupadv/store',
      method: 'post',
      data
    })
  }