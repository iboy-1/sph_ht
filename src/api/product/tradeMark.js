import request from '@/utils/request'

// 获取分类列表
export const getTradeMarkList = (page, limit) => request({url: `/admin/product/baseTrademark/${page}/${limit}`,method: 'get'})

// 添加分类
export function addTradeMark(data) {
    return request ({
        url: '/admin/product/baseTrademark/save',
        method: 'post',
        data
    })
}

// 删除分类
export const delTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method: 'delete'})

// 修改分类
export function updateTradeMark(data) {
    return request ({
        url: '/admin/product/baseTrademark/update',
        method: 'put',
        data
    })
}