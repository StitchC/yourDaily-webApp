// 这里只有get 的接口方法 post 请求写在组件内部 因为axios 的post 太麻烦！

import axios from 'axios';


// 登录请求接口
export const login = function(url, args) {
  return axios.get(url, {
    params: args
  });
};


// 获取用户所有数据接口
export const getAllData = function(url, args) {
  return axios.get(url, {
    params: args
  });
};


// 获取用户个人信息接口
export const getUserInfo = function(url, args) {
  return axios.get(url, {
    params: args
  });
};
