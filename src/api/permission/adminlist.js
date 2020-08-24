import request from '@/utils/request'

export function SelectAdminList(data) {
    return request({
        url: '/api/admin/selectAdminList',
        method: 'post',
        data
    })
}
export function addAdminInfo(data) {
    return request({
        url: '/api/admin/addAdminInfo',
        method: 'post',
        data
    })
}
export function editAdminInfo(data) {
    return request({
        url: '/api/admin/editAdminInfo',
        method: 'post',
        data
    })
}
export function getSupplierList(data) {
    return request({
        url: '/api/Supplier/getSupplierList',
        method: 'post',
        data
    })
}
export function getOrgList(data) {
    return request({
        url: '/api/org/index',
        method: 'post',
        data
    })
}
export function delAdminInfo(data) {
    return request({
        url: '/api/admin/delAdminInfo',
        method: 'post',
        data
    })
}

export function getRoles(data) {
    return request({
        url: '/api/Admin/getRoles',
        method: 'post',
        data
    })
}
export function findAdminInfo(data) {
    return request({
        url: '/api/admin/findAdminInfo',
        method: 'post',
        data
    })
}
export function resetAdminPassword(data) {
    return request({
        url: '/api/admin/resetAdminPassword',
        method: 'post',
        data
    })
}
export function resetAuthTimes(data) {
    return request({
        url: '/api/admin/resetAuthTimes',
        method: 'post',
        data
    })
}