import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login/login'
Vue.use(Router);
const route = [];
// 懒加载
route.push({
    path: '/',
    name: 'login',
    component: login
  },
  {
    path:'/welcome',
    name:'welcome',
    component: resolve => require(['../components/welcome.vue'], resolve)
  },
  {
    path:'/userMessage',
    name:'userMessage',
    component: resolve => require(['../components/userPages/userMessage.vue'], resolve)
  },
  {
    path:'/communitySystem',
    name:'communitySystem',
    component: resolve => require(['../components/friendSysrem/communitySystem.vue'], resolve)
  },
  {
    path:'/activitySystem',
    name:'activitySystem',
    component: resolve => require(['../components/friendSysrem/activitySystem.vue'], resolve)
  },
  {
    path:'/tourRouteSystem',
    name:'tourRouteSystem',
    component: resolve => require(['../components/hbtvSystem/tourRouteSystem.vue'], resolve)
  },
  {
    path:'/tourSignList',
    name:'tourSignList',
    component: resolve => require(['../components/hbtvSystem/tourSignList.vue'], resolve)
  },
  {
    path:'/dataPageSystem',
    name:'dataPageSystem',
    component: resolve => require(['../components/hbtvSystem/dataPageSystem.vue'], resolve)
  },
  {
    path:'/dataSignList',
    name:'dataSignList',
    component: resolve => require(['../components/hbtvSystem/dataSignList.vue'], resolve)
  },
  {
    path:'/act',
    name:'act',
    component: resolve => require(['../components/hbtvSystem/act.vue'], resolve)
  },
  {
    path:'/actSignList',
    name:'actSignList',
    component: resolve => require(['../components/hbtvSystem/actSignList.vue'], resolve)
  });
export default new Router({
  routes: route
})
