import request from '@/utils/request'
export function getOperatorLog(data) {
    return request({
        url: '/api/System/getOperatorLog',
        method: 'post',
        data
    })
}