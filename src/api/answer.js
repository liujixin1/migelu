import request from '@/utils/request'
export function selectCePingList(data) {
    return request({
        url: '/api/answer/selectCePingList',
        method: 'post',
        data
    })
}