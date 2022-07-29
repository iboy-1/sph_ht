import request from '@/utils/request'

// 获取菜单列表
export function getMenuList() {
    return request({
        url: '/admin/acl/permission',
        method: 'get'
    })
}

// 添加菜单
export function addMenu(data) {
    return request({
        url: '/admin/acl/permission/save',
        method: 'post',
        data
    })
}

// 修改菜单
export function updateMenu(data) {
    return request({
        url: '/admin/acl/permission/update',
        method: 'put',
        data
    })
}

// 删除某个节点菜单
export function deleteMenu(id) {
    return request({
        url: `/admin/acl/permission/remove/${id}`,
        method: 'delete'
    })
}