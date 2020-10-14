import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 新增一条新的vphoto活动数据
export function fetchAddVphoto(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/addVphoto`,
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