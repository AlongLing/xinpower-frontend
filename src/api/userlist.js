// 用于和云数据库打交道
import request from '@/utils/request'
const baseURL = 'http://localhost:3000'

// 获取用户列表数据
export function fetchUserList(params) {
  return request({
    params,
    url: `${baseURL}/userlist/list`,
    method: 'get'
  })
}

// 根据 user _id 查找用户数据
export function fetchUserById(params) {
  return request({
    params,
    url: `${baseURL}/userlist/getUserById`,
    method: 'get'
  })
}

// 根据 user telephone 查询用户数据
export function fetchUserByTelephone(params) {
  return request({
    params,
    url: `${baseURL}/userlist/getUserByTelephone`,
    method: 'get'
  })
}

// 插入一条新的用户数据
export function addUser(params) {
  return request({
    params,
    url: `${baseURL}/userlist/addUser`,
    method: 'post'
  })
}

// 更新用户的积分和成长值(已废弃，待删除)
export function updateScoreAndGrowthValue(params) {
  return request({
    params,
    url: `${baseURL}/userlist/updateScoreAndGrowthValue`,
    method: 'post'
  })
}

// 更新用户积分和积分说明
export function updateScoreById(params) {
  return request({
    params,
    url: `${baseURL}/userlist/updateScoreById`,
    method: 'post'
  })
}

// 更新用户成长值和成长值说明
// todo: 明天再来写

// 根据user _id 删除用户
export function deleteUser(params) {
  return request({
    params,
    url: `${baseURL}/userlist/deleteUser`,
    method: 'get'
  })
}