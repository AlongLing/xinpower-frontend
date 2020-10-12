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
export function fetchVphotoById(params) {
  return request({
    params,
    url: `${baseURL}/vphoto/getVphotoById`,
    method: 'get',
  })
}