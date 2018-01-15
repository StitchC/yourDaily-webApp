import * as type from './mutation-types';
import axios from 'axios';

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
    });
  });
};
