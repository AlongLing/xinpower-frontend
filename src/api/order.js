import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 获取订单的列表数据
export function fetchOrderList(params) {
    return request({
        params,
        url: `${baseURL}/order/getOrderList`,
        method: 'get'
    })
}

// 根据用户的电话号码查找该用户的订单数据
export function fetchOrderListByUserPhone(params) {
    return request({
        params,
        url: `${baseURL}/order/getOrderListByUserPhone`,
        method: 'get'
    })
}

// 根据订单 id 查找订单信息
export function fetchOrderById(params) {
    return request({
        params,
        url: `${baseURL}/order/getOrderById`,
        method: 'get'
    })
}

// 根据订单 id 修改订单的快递单号和订单状态
export function updateOrderIdAndState(params) {
    return request({
        params,
        url: `${baseURL}/order/updateOrderIdAndState`,
        method: 'post'
    })
}

// 根据订单 id 删除订单信息
export function deleteOrderById(params) {
    return request({
        params,
        url: `${baseURL}/order/deleteOrderById`,
        method: 'get'
    })
}

// 根据订单 _id 修改订单状态
export function fetchUpdateOrderStateByOrderId(params) {
    return request({
        params,
        url: `${baseURL}/order/updateOrderStateByOrderId`,
        method: 'post'
    })
}