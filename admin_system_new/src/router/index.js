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
    path:'/welcomeNoRight',
    name:'welcomeNoRight',
    component: resolve => require(['../components/welcomeNoRight.vue'], resolve),
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
  /**
   * 红娘
   * */
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
  {
    path:'/configureStartPage',
    name:'configureStartPage',
    component: resolve => require(['../components/friendSysrem/configureStartPage.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureRecord',
    name:'configureRecord',
    component: resolve => require(['../components/friendSysrem/configureRecord.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureMessage',
    name:'configureMessage',
    component: resolve => require(['../components/friendSysrem/configureMessage.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureMessageIcon',
    name:'configureMessageIcon',
    component: resolve => require(['../components/friendSysrem/configureMessageIcon.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  {
    path:'/configureStyle',
    name:'configureStyle',
    component: resolve => require(['../components/friendSysrem/configureStyle.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
  //电视专栏
  {
    path:'/tourBanner',
    name:'tourBanner',
    component: resolve => require(['../components/hbtvSystem/configureBanner.vue'], resolve),
    meta:{
      requireAuth:true
    }
  },
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
  },
  /**
   * 营养师
   * */
  {
    path:'/configureHealthBanner',
    name:'configureHealthBanner',
    component: resolve => require(['../components/yysSystem/configureHealthBanner.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthCoupon',
    name:'configureHealthCoupon',
    component: resolve => require(['../components/yysSystem/configureHealthCoupon.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthGuideClass',
    name:'configureHealthGuideClass',
    component: resolve => require(['../components/yysSystem/configureHealthGuideClass.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthKnowledge',
    name:'configureHealthKnowledge',
    component: resolve => require(['../components/yysSystem/configureHealthKnowledge.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthKnowledgeClass',
    name:'configureHealthKnowledgeClass',
    component: resolve => require(['../components/yysSystem/configureHealthKnowledgeClass.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthProducts',
    name:'configureHealthProducts',
    component: resolve => require(['../components/yysSystem/configureHealthProducts.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthProductTrend',
    name:'configureHealthProductTrend',
    component: resolve => require(['../components/yysSystem/configureHealthProductTrend.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthQuestion',
    name:'configureHealthQuestion',
    component: resolve => require(['../components/yysSystem/configureHealthQuestion.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthQuestionComment',
    name:'configureHealthQuestionComment',
    component: resolve => require(['../components/yysSystem/configureHealthQuestionComment.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHealthKey',
    name:'configureHealthKey',
    component: resolve => require(['../components/yysSystem/configureHealthKey.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  /**
   * 系统管理
   * */
   {
    path:'/configureOrganization',
    name:'configureOrganization',
    component: resolve => require(['../components/sysSystem/configureOrganization.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureShopAndUser',
    name:'configureShopAndUser',
    component: resolve => require(['../components/sysSystem/configureShopAndUser.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureApartment',
    name:'configureApartment',
    component: resolve => require(['../components/sysSystem/configureApartment.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureNews',
    name:'configureNews',
    component: resolve => require(['../components/sysSystem/configureNews.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHospitalNews',
    name:'configureHospitalNews',
    component: resolve => require(['../components/hospitalNews/configureHospitalNews.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
  {
    path:'/configureHospitalNewsType',
    name:'configureHospitalNewsType',
    component: resolve => require(['../components/hospitalNews/configureHospitalNewsType.vue'], resolve),
    meta:{
      requireAuth:true
    },
  },
);
export default new Router({
  routes: route
})
