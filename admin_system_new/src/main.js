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
import dialogView from './components/public/dialog/addDialog'
import 'iview/dist/styles/iview.css'
import store from './sotre/store'
import trans from './assets/js/timeTrans'
import 'babel-polyfill' //es6转es5 兼容ie
Vue.prototype.$trans = trans;
Vue.config.productionTip = false;
Vue.use(iView);
Vue.component('back-view',backView);
Vue.component('header-view',headerView);
Vue.component('nav-view',navView);
Vue.component('tab-view',tabView);
Vue.component('add-view',dialogView);
// Vue.component('com-add-view',comAddView);
/* eslint-disable no-new */
router.beforeEach((to,from,next) =>{
  store.state.admin_token = sessionStorage.getItem('userName');
  if (to.meta.requireAuth) {
    if ( store.state.admin_token !== '' &&  store.state.admin_token != null) {
      next()
    } else {
      next({
        path:'/'
      })
    }
  }else {
    next()
  }
});
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
