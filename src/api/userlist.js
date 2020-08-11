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

// 根据 user id 查找用户数据
export function fetchUserById(params) {
  return request({
    params,
    url: `${baseURL}/userlist/getUserById`,
    method: 'get'
})
} 