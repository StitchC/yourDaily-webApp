import * as type from './mutation-types';

const mutations = {
  [type.UPDATE_DAILY](state, newData) {
    state.userDailies = newData;
  },
  [type.TOGGLE_SELECT_SEX](state, bool) {
    state.selectSexShow = bool;
  },
  [type.UPDATE_USER_INFO](state, newData) {
    state.userInfo = newData;
  }
};

export default mutations;
