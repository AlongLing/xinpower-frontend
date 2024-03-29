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

// 根据商品_id获取商品首图
export function fetchFirstPictureList(params) {
  return request({
    params,
    url: `${baseURL}/goods/firstPictureList`,
    method: 'get'
  })
}

// 根据商品_id获取商品小图
export function fetchSmallPictureList(params) {
  return request({
    params,
    url: `${baseURL}/goods/smallPictureList`,
    method: 'get'
  })
}

// 根据商品_id获取商品大图
export function fetchBigPictureList(params) {
  return request({
    params,
    url: `${baseURL}/goods/bigPictureList`,
    method: 'get'
  })
}

// 根据商品_id获取商品信息，不包括图片
export function fetchGoodsById(params) {
  return request({
    params,
    url: `${baseURL}/goods/fetchGoodsById`,
    method: 'get'
  })
}

// 删除商品图片
export function del(params) {
  return request({
      params,
      url: `${baseURL}/goods/del`,
      method: 'get',
  })
}

// 修改商品状态(上架/下架)
export function updateGoodsState(params) {
  return request({
    params,
    url: `${baseURL}/goods/updateGoodsState`,
    method: 'post',
  })
}

// 修改新增商品的名称，价格，类型
export function fetchNewGoods(params) {
  return request({
    params,
    url: `${baseURL}/goods/addNewGoods`,
    method: 'post',
  })
}

// 获取所有商品列表数据
export function fetchGoodsList(params) {
  return request({
    params,
    url: `${baseURL}/goods/getGoodsList`,
    method: 'get',
  })
}