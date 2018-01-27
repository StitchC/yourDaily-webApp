// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index.js';
import VueResource from 'vue-resource';
import store from './vuex/index';
import lazyload from 'vue-lazyload';

// 导入样式表
import 'common/stylus/index.styl';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(lazyload, {
  preLoad: 1.3,
  loading: './static/images/lazyloadicon.gif',
  attempt: 3
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
