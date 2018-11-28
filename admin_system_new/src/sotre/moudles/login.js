import * as types from '../types'

const state = {
  admin_token:''
};

const mutations = {
  [types.ADMIN_TOKEN] (state,res) {
    state.admin_token = res;
  }
};

const actions = {
  setUserInfo ({commit},res) {
    sessionStorage.setItem('userInfo',JSON.stringify(res));
    commit(types.ADMIN_TOKEN,res)
  }
};

export default {
  state,
  mutations,
  actions
}
