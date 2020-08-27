import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchSwiperHomeList(){
    return request({
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