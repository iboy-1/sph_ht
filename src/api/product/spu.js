import request from '@/utils/request'

// 获取Spu列表
export const getSpuList = (page, limit, category3Id) => {
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: 'get',
        params: {category3Id}
    })
}

// 获取品牌列表
export const getTradeMarkList = () => {
    return request({
        url: '/admin/product/baseTrademark/getTrademarkList',
        method: 'get'
    })
}

// 获取平台中的全部销售属性
export const getBaseSaleAttrList = () => {
    return request({
        url: '/admin/product/baseSaleAttrList',
        method: 'get'
    })
} 

// 获取某一个Spu的信息
export const getSpuById = (id) => {
    return request({
        url: `/admin/product/getSpuById/${id}`,
        method: 'get'
    })
}

// 获取某一个Spu图片
export const getSpuImg = (id) => {
    return request({
        url: `/admin/product/spuImageList/${id}`
    })
}

// 修改spu
export const update = (data) => {
    return request({
        url: '/admin/product/updateSpuInfo',
        method: 'post',
        data
    })
}

// 添加spu
export const add = (data) => {
    return request({
        url: '/admin/product/saveSpuInfo',
        method: 'post',
        data
    })
}

// 删除spu
export const del = (id) => {
    return request({
        url: `/admin/product/deleteSpu/${id}`,
        method: 'delete'
    })
}