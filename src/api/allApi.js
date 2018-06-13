import axios from 'axios';


// 登录请求接口
export const login = function(args) {
  return axios.get('/yourdaily/login', {
    params: args
  });
};


// 注册接口
export const register = function(args) {
  return axios.post('/yourdaily/register', args);
};


// 获取用户所有数据接口
export const getAllData = function(args) {
  return axios.get('/yourdaily/users/getUserData', {
    params: args
  });
};


// 获取用户个人信息接口
export const getUserInfo = function(args) {
  return axios.get('yourdaily/users/getUserInfo', {
    params: args
  });
};



// 修改性别接口
export const modifySex = function(args) {
  return axios.post('/yourdaily/users/modifySex', args);
};


// 修改用户昵称
export const modifyUserName = function(args) {
  return axios.post('/yourdaily/users/modifyUserName', args);
};


// 修改用户格言
export const modifyUserMotto = function(args) {
  return axios.post('yourdaily/users/modifyMotto', args);
};


// 上传日记
export const uploadDaily = function(args) {
  return axios.post('yourdaily/users/uploadDaily', args, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
};


// 删除日记
export const deleteDaily = function(args) {
  return axios.post('yourdaily/users/deleteDaily', args);
};



// 上传用户头像
export const uploadAvatar = function(args) {
  return axios.post('yourdaily/users/uploadAvatar', args, {
    headers: {
      'content-type': 'multipart/form-data'
    }
  });
};
