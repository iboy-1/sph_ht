import request from '@/utils/request'

// 获取一级列表
export const getCategoryOne = () => {
    return request({
        url: '/admin/product/getCategory1',
        method: 'get',
    })
}

// 获取二级列表
export const getCategoryTwo = (id) => {
    return request({
        url: `/admin/product/getCategory2/${id}`,
        method: 'get'
    })
}

// 获取三级列表
export const getCategoryThree = (id) => {
    return request({
        url: `/admin/product/getCategory3/${id}`,
        method: 'get'
    })
}

// 获取商品基础属性列表
export const getCategoryDetail = (one_id, two_id, three_id) => {
    return request({
        url: `/admin/product/attrInfoList/${one_id}/${two_id}/${three_id}`,
        method: 'get'
    })
} 

// 添加商品属性
export const addAttr = (data) => {
    return request({
        url: '/admin/product/saveAttrInfo',
        method: 'post',
        data: data
    })
}

// 删除品牌属性
export const delAttr = (id) => {
    return request({
        url: `/admin/product/deleteAttr/${id}`,
        method: 'delete'
    })
}