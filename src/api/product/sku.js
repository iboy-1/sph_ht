import request from '@/utils/request'

export default {
    // 获取销售属性的数据
    getSpuSaleAttrList(id) {
        return request({
            url: `/admin/product/spuSaleAttrList/${id}`,
            method: 'get'
        })
    },

    // 添加sku
    addSku(data) {
        return request({
            url: '/admin/product/saveSkuInfo',
            method: 'post',
            data
        })
    },

    // 获取某个spu的sku列表
    getSkuList(spuId) {
        return request({
            url: `/admin/product/findBySpuId/${spuId}`,
            method: 'get'
        })
    },

    // 获取sku列表
    getSkuListData(page, limit) {
        return request({
            url: `/admin/product/list/${page}/${limit}`,
            method: 'get'
        })
    },

    // 删除sku
    deleteSku(id) {
        return request({
            url: `/admin/product/deleteSku/${id}`,
            method: 'delete'
        })
    },

    // 上架
    setSkuOnSale(id) {
        return request({
            url: `/admin/product/onSale/${id}`,
            method: 'get'
        })
    },

    // 下架
    setSkuCancelSale(id) {
        return request({
            url: `/admin/product/cancelSale/${id}`,
            method: 'get'
        })
    }
}