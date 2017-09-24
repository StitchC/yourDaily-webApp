import Vue from 'vue';
import Vuex from 'vuex';

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
  }
});
