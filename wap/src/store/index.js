import Vue from 'vue'
import Vuex from 'vuex'
import utils from "../utils"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:utils.getLocalStorage("token") || "",
    me:utils.getLocalStorage("me") || {},
    count:utils.getLocalStorage("account") || {},
  },
  mutations: {
    handleToken(state,token){
      state.token = token;
      utils.setLocalStorage("token",token)
    },
    handleMe(state,me){
      state.me = me;
      utils.setLocalStorage("me",me)
    },
    handleAccout(state,payload){
      if(payload.remember){
        state.count = payload;
        utils.setLocalStorage("account",payload)
      }else{
        state.count = {};
        utils.removeLocalStorage("account")
      }
    },
    handleLogout(state){
      state.token = null;
      state.me = null;
      utils.removeLocalStorage("token")
      utils.removeLocalStorage("me")
    }
  },
  actions: {
    Login(context,payload){
      return new Promise((resolve,reject)=>{
        let api = Vue.prototype.$http.api.auth.login(
          payload.username,payload.password
        );
        Vue.prototype.$http.callapi(api).then(res=>{
          context.commit("handleToken",res.data);
          context.dispatch("GetMe").then(resolve).catch(reject)
          resolve(res)
        }).catch(reject)
      })
    },
    GetMe(context,payload){
      return new Promise((resolve,reject)=>{
        let api = Vue.prototype.$http.api.member.getMe();
        Vue.prototype.$http.callapi(api).then(res=>{
          context.commit('handleMe',res.data);
          resolve(res.data)
        }).catch(reject)
      })
    }
  },
  modules: {

  }
})
