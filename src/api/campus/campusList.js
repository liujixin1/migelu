import request from '@/utils/request'
//校区下拉框
export function getSelectSchool(data) {
    return request({
        url: 'api/select/getSelectSchool',
        method: 'post',
        data
    })
}
//校区列表
export function campusList(data) {
    return request({
        url: 'api/school/index',
        method: 'post',
        data
    })
}
//校区明细
export function particularsSchool(data) {
    return request({
        url: 'api/school/show',
        method: 'post',
        data
    })
}
//校区添加
export function addSchool(data) {
    return request({
        url: 'api/school/store',
        method: 'post',
        data
    })
}
//校区修改
export function modificationSchool(data) {
    return request({
        url: 'api/school/update',
        method: 'post',
        data
    })
}
//校区删除
export function deleteSchool(data) {
    return request({
        url: 'api/school/destroy',
        method: 'post',
        data
    })
}