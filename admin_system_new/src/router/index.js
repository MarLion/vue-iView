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
    component: resolve => require(['../components/welcome.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/superAdmin',
    name:'superAdmin',
    component: resolve => require(['../components/superAdmin/superAdmin.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/userMessage',
    name:'userMessage',
    component: resolve => require(['../components/userPages/userMessage.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  //相亲交友
  {
    path:'/communitySystem',
    name:'communitySystem',
    component: resolve => require(['../components/friendSysrem/communitySystem.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/communityUserList',
    name:'communityUserList',
    component: resolve => require(['../components/friendSysrem/communityUserList.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/activitySystem',
    name:'activitySystem',
    component: resolve => require(['../components/friendSysrem/activitySystem.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/activityUserList',
    name:'activityUserList',
    component: resolve => require(['../components/friendSysrem/activityUserList.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureGift',
    name:'configureGift',
    component: resolve => require(['../components/friendSysrem/configureGift.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureLabel',
    name:'configureLabel',
    component: resolve => require(['../components/friendSysrem/configureLabel.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configurePosition',
    name:'configurePosition',
    component: resolve => require(['../components/friendSysrem/configurePosition.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureQuestion',
    name:'configureQuestion',
    component: resolve => require(['../components/friendSysrem/configureQuestion.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureFirstModel',
    name:'configureFirstModel',
    component: resolve => require(['../components/friendSysrem/configureFirstModel.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureArticle',
    name:'configureArticle',
    component: resolve => require(['../components/friendSysrem/configureArticle.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureBanner',
    name:'configureBanner',
    component: resolve => require(['../components/friendSysrem/configureBanner.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureTrends',
    name:'configureTrends',
    component: resolve => require(['../components/friendSysrem/configureTrends.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  //电视专栏
  {
    path:'/tourRouteSystem',
    name:'tourRouteSystem',
    component: resolve => require(['../components/hbtvSystem/tourRouteSystem.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/tourSignList',
    name:'tourSignList',
    component: resolve => require(['../components/hbtvSystem/tourSignList.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/dataPageSystem',
    name:'dataPageSystem',
    component: resolve => require(['../components/hbtvSystem/dataPageSystem.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/dataSignList',
    name:'dataSignList',
    component: resolve => require(['../components/hbtvSystem/dataSignList.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/act',
    name:'act',
    component: resolve => require(['../components/hbtvSystem/act.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/actSignList',
    name:'actSignList',
    component: resolve => require(['../components/hbtvSystem/actSignList.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/actTicketSystem',
    name:'actTicketSystem',
    component: resolve => require(['../components/hbtvSystem/actTicketSystem.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/actTicketSignList',
    name:'actTicketSignList',
    component: resolve => require(['../components/hbtvSystem/actTicketSignList.vue'], resolve),
    meta:{
      requireAuth:true
    },
  }
  );
export default new Router({
  routes: route
})
