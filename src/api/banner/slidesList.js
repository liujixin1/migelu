import request from '@/utils/request'
//首页轮播图列表
export function index(data) {
    return request({
        url: 'api/Bannerhead/index',
        method: 'post',
        data
    })
}
//首页轮播图获取详情
export function show(data) {
    return request({
        url: 'api/Bannerhead/show',
        method: 'post',
        data
    })
}
//修改首页轮播图
export function update(data) {
    return request({
        url: 'api/Bannerhead/update',
        method: 'post',
        data
    })
}
//删除首页轮播图
export function destroy(data) {
    return request({
        url: 'api/Bannerhead/destroy',
        method: 'post',
        data
    })
}
//添加首页轮播图
export function add(data) {
    return request({
        url: 'api/Bannerhead/store',
        method: 'post',
        data
    })
}