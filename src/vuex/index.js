import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userData: {},
    selectSexShow: false
  },
  mutations: {
    updateData: function(state, newData) {
      state.userData = newData;
    },
    toggleSelectSex: function(state, newData) {
      state.selectSexShow = newData;
    }
  },
  actions: {
    requestNewData: function(context, args) {
      return new Promise((resolve, reject) => {
       axios.get('/yourdaily/php/user/getUserData.php', {
         params: args
       }).then((res) => {
         context.commit('updateData', res.data);
         resolve();
       });
      });
    }
  }
});
