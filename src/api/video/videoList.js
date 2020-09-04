import request from '@/utils/request'
//视频库列表
export function index(data) {
    return request({
        url: 'api/videostore/index',
        method: 'post',
        data
    })
}
//修改视频
export function updata(data) {
    return request({
        url: 'api/videostore/updata',
        method: 'post',
        data
    })
}
//删除视频
export function destroy(data) {
    return request({
        url: 'api/videostore/destroy',
        method: 'post',
        data
    })
}
//添加视频
export function store(data) {
    return request({
        url: 'api/videostore/store',
        method: 'post',
        data
    })
}