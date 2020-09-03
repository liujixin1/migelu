import request from '@/utils/request'
//首页广告图列表
export function index(data) {
    return request({
        url: 'api/Bannerfoot/index',
        method: 'post',
        data
    })
}
//添加广告图列表
export function add(data) {
    return request({
        url: 'api/Bannerfoot/store',
        method: 'post',
        data
    })
}
//修改广告图
export function update(data) {
    return request({
        url: 'api/Bannerfoot/update',
        method: 'post',
        data
    })
}
//广告图获取详情
export function show(data) {
    return request({
        url: 'api/Bannerfoot/show',
        method: 'post',
        data
    })
}
//删除广告图
export function destroy(data) {
    return request({
        url: 'api/Bannerfoot/destroy',
        method: 'post',
        data
    })
}