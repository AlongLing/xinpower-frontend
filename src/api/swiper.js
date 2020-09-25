import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchSwiperHomeList(params){
    return request({
        params,
        url: `${baseURL}/swiper/homelist`,
        method: 'get'
    })
}

export function fetchBigPictureList(params) {
    return request({
        params,
        url: `${baseURL}/swiper/bigPictureList`,
        method: 'get'
    })
}

export function fetchDetailPictureList(params) {
    return request({
        params,
        url: `${baseURL}/swiper/detailPictureList`,
        method: 'get'
    })
}

// 删除轮播商品图片
export function del(params) {
    return request({
        params,
        url: `${baseURL}/swiper/del`,
        method: 'get',
    })
}

// 修改新增商品的名称和价格
export function fetchNewGoods(params) {
    return request({
        params,
        url: `${baseURL}/swiper/addNewGoods`,
        method: 'post',
    })
}

// 修改轮播商品的状态
export function updateSwiperGoodsState(params) {
    return request({
        params,
        url: `${baseURL}/swiper/updateSwiperGoodsState`,
        method: 'post',
    })
}