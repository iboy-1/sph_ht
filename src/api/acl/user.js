import request from '@/utils/request'

export default {
    // 获取管理用户分页列表
    getUserList(page, limit) {
        return request({
            url: `/admin/acl/user/${page}/${limit}`,
            method: 'get'
        })
    },

    // 获取管理用户
    getUser(id) {
        return request({
            url: `/admin/acl/user/get/${id}`,
            method: 'get'
        })
    },

    // 修改管理用户
    updateUser(data) {
        return request({
            url: '/admin/acl/user/update',
            method: 'put',
            data
        })
    },

    // 根据用户获取角色数据
    getUserRole(id) {
        return request({
            url: `/admin/acl/user/toAssign/${id}`,
            method: 'get',
        })
    },

    // 根据用户分配角色
    assignRoles(data) {
        return request({
            url: '/admin/acl/user/doAssign',
            method: 'post',
            params: data
        })
    },

    // 添加管理用户
    addUser(data) {
        return request({
            url: '/admin/acl/user/save',
            method: 'post',
            data
        })
    },

    // 删除管理用户
    delUser(id) {
        return request({
            url: `/admin/acl/user/remove/${id}`,
            method: 'delete'
        })
    },

    // 根据id列表删除管理用户
    delUserList(data) {
        return request({
            url: '/admin/acl/user/batchRemove',
            method: 'delete',
            data
        })
    }
}