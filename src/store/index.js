import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const state =sessionStorage.getItem('state')?JSON.parse(sessionStorage.getItem('state')):{
  user:{
    username:''
  }
};

const getters ={
  getUser(state){
    return state.user;
  }
};

const mutations ={
  //同步操作
  //
  updateUser(state,user){
    state.user=user;
  }
};

const actions ={
//Action 可以包含任意异步操作
  //通过this.$store.dispatch('asyncUpdateUser')触发
  asyncUpdateUser(context,user){
    context.commit('updateUser',user);
  }
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
