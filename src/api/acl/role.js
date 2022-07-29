import request from '@/utils/request'

// 获取角色列表
export const getRoleList = (page, limit) => {
    return request({
        url: `/admin/acl/role/${page}/${limit}`,
        method: 'get'
    })
}

// 添加角色
export const addRole = (data) => {
    return request({
        url: '/admin/acl/role/save',
        method: 'post',
        data
    })
}

// 删除角色
export const deleteRole = (id) => {
    return request({
        url: `/admin/acl/role/remove/${id}`,
        method: 'delete'
    })
}

// 根据id列表删除角色
export const deleteRoleList = (data) => {
    return request({
        url: '/admin/acl/role/batchRemove',
        method: 'delete',
        data
    })
}

// 更新角色
export const updateRole = (data) => {
    return request({
        url: '/admin/acl/role/update',
        method: 'put',
        data
    })
}

// 根据角色获取菜单
export const getRole = (id) => {
    return request({
        url: `/admin/acl/permission/toAssign/${id}`,
        method: 'get'
    })
}

// 给角色分配权限
export const setAuth = (data) => {
    return request({
        url: '/admin/acl/permission/doAssign',
        method: 'post',
        params: data
    })
}