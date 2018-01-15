import Vue from 'vue';
import Vuex from 'vuex';
// import axios from 'axios';
import state from './state';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

import createLogger from 'vuex/dist/logger';

const debug = process.env.NODE_ENV !== 'production';
Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  // actions: {
  //   requestNewData: function(context, args) {
  //     return new Promise((resolve, reject) => {
  //      axios.get('/yourdaily/php/user/getUserData.php', {
  //        params: args
  //      }).then((res) => {
  //        context.commit('updateData', res.data);
  //        resolve();
  //      });
  //     });
  //   }
  // },
  plugins: debug ? [createLogger()] : []
});
