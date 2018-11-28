// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import backView from './components/public/backgorund/background'
import headerView from './components/public/header/header'
import navView from './components/public/nav/nav'
import tabView from './components/public/tab/tab'
// import comAddView from './components/friendSysrem/communityAdd'
import dialogView from './components/public/dialog/addDialog'
import 'iview/dist/styles/iview.css'
import store from './sotre/store'
Vue.config.productionTip = false;
Vue.use(iView);
Vue.component('back-view',backView);
Vue.component('header-view',headerView);
Vue.component('nav-view',navView);
Vue.component('tab-view',tabView);
Vue.component('add-view',dialogView);
// Vue.component('com-add-view',comAddView);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
