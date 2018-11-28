/**
 * 状态集中管理处
 * */
import Vue from 'vue'
import Vuex from 'vuex'
import login from './moudles/login'
Vue.use(Vuex);
const INT_ARR = 'INT_ARR'; //初始化导航、页签
const ADD_TAB_LIST = 'ADD_TAB_LIST'; //添加页签
const REMOVE_TAB_LIST = 'REMOVE_TAB_LIST'; //删除页签
const ACTIVE_TAB = 'ACTIVE_TAB'; //活动菜单、页签关联
const ADD_OPEN = 'ADD_OPEN'; //展开菜单
export default new Vuex.Store ({
  modules:{
    login
  },
  state:{
    tabList:[],
    activeTab:'',
    openName:[],
    //adminToken:''//登录token
  },
  mutations:{
    //初始化导航菜单 页签数组
    [INT_ARR] :function (state) {
      state.tabList = [];
      state.activeTab = '';
      state.openName = [];

    },
    //添加页签
    [ADD_TAB_LIST] :function (state,item) {
      let isPush = false;
      //先做判断 tab列表为0 将菜单push进list 不为0 则做比较 重复的不要
      if(state.tabList.length === 0){
        state.tabList.push(item);
      } else {
        for (let i = 0 ; i < state.tabList.length; i++){
          if(item.name === state.tabList[i].name) {
            return
          } else {
            isPush = true;
          }
        }
      }
      if(isPush){
        state.tabList.push(item);
      }
      sessionStorage.setItem('navArr',JSON.stringify(state.tabList));
    },
    //删除页签
    [REMOVE_TAB_LIST] :function (state,item) {
      //比较传入的name 相同则删除
      let isDelete = false;
      let index = '';
      for (let i = 0; i < state.tabList.length; i++){
        if (item === state.tabList[i].name) {
          isDelete = true;
          index = i;
        }
      }
      if (isDelete) {
        state.tabList.splice(index,1);
        sessionStorage.setItem('navArr',JSON.stringify(state.tabList));
      }
    },
    //页签与导航菜单关联
    [ACTIVE_TAB] :function (state,item) {
      state.activeTab = item;
      sessionStorage.setItem('active',item);
    },
    //记录展开菜单
    [ADD_OPEN] :function (state,arr) {
      state.openName = arr;
      sessionStorage.setItem('open',JSON.stringify(state.openName));
    }
  }
})
