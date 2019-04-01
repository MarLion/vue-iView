import * as types from '../types'

const state = {
  admin_token:'',
  user_id:''
};

const mutations = {
  [types.ADMIN_TOKEN] (state,res) {
    state.admin_token = res;
  },
  [types.USER_ID] (state,res) {
    state.user_id = res;
  },
};

const actions = {
  setUserInfo ({commit},res) {
    sessionStorage.setItem('userName',res);
    commit(types.ADMIN_TOKEN,res)
  },
  setUserId ({commit},res) {
    sessionStorage.setItem(('userId'),res);
    commit(types.USER_ID,res)
  } ,
};

export default {
  state,
  mutations,
  actions
}
