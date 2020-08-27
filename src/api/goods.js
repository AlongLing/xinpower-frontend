import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 插入一条新的商品数据
export function addGoods() {
    return request({
      url: `${baseURL}/goods/addGoods`,
      method: 'post'
    })
  }

  // 获取商品分类的列表数据
export function fetchGoodsTypeList(params) {
  return request({
      params,
      url: `${baseURL}/goods/goodsTypeList`,
      method: 'get'
  })
}