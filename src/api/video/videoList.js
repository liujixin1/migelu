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
//视频详情
export function show(data) {
    return request({
        url: 'api/videostore/show',
        method: 'post',
        data
    })
}
//获取七牛云上传存储文件认证
export function getUpToken(data) {
    return request({
        url: 'api/Common/getUpToken',
        method: 'post',
        data
    })
}