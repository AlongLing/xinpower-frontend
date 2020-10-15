import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 根据_id更新vphoto活动数据
export function updateVphotoById(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/updateVphotoById`,
    method: 'post'
  })
}

// 获取 vphoto 列表数据
export function fetchVphotoList(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/getVphotoList`,
    method: 'get',
  })
}

// 根据 _id 查找 vphoto 实例
export function fetchPictureListById(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/getPictureListById`,
    method: 'get',
  })
}

// 更新后台 vphoto id 的值
export function updateVphotoId(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/updateVphotoId`,
    method: 'get',
  })
}

export function updatePictureInfo(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/updatePictureInfo`,
    method: 'post',
  })
}

// 删除图片
export function del(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/del`,
    method: 'get',
  })
}

// 根据 _id 查找 vphoto 实例
export function fetchVphotoById(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/getVphotoById`,
    method: 'get',
  })
}

// 删除vphoto实例以及对应的海报
export function deleteVphotoById(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/deleteVphotoById`,
    method: 'get',
  })
}