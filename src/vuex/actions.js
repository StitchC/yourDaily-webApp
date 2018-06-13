import * as type from './mutation-types';
import {getAllData, getUserInfo} from 'api/allApi.js';

// 重新加载全部用户数据 包括日记及个人信息
export const reloadData = function({commit}, {id, connectId}) {
  return new Promise((resolve, reject) => {
    getAllData({
      id,
      connectId
    }).then((res) => {
      commit(type.UPDATE_DAILY, res.data.daily);
      commit(type.UPDATE_USER_INFO, res.data.info);
      resolve();
    }).catch(() => {
      reject();
    });
  });
};

// 重新加载用户信息
export const reloadUserInfo = function({commit}, {id}) {
  return new Promise((resolve, reject) => {
    getUserInfo({
        id
    }).then((res) => {
      commit(type.UPDATE_USER_INFO, res.data.info);
      resolve();
    }).catch(() => {
      reject();
    });
  });
};
