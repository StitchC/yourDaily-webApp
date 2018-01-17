import * as type from './mutation-types';
import axios from 'axios';

// 重新加载全部用户数据 包括日记及个人信息
export const reloadData = function({commit}, {id, connectId}) {
  return new Promise((resolve, reject) => {
    axios.get('/yourdaily/php/user/getUserData.php', {
      params: {
        id,
        connectId
      }
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
export const reloadUserInfo = function({commit}, {id, connectId}) {
  return new Promise((resolve, reject) => {
    axios.get('/yourdaily/php/user/getUserInfo.php', {
      params: {
        id,
        connectId
      }
    }).then((res) => {
      commit(type.UPDATE_USER_INFO, res.data.info);
      resolve();
    }).catch(() => {
      reject();
    });
  });
};
