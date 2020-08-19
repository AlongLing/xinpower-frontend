import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

export function fetchSwiperHomeList(){
    return request({
        url: `${baseURL}/swiper/homelist`,
        method: 'get'
    })
}