import Vue from 'vue'
import Vuex from 'vuex'
import utils from "../utils"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:utils.getLocalStorage("token") || "",
  },
  mutations: {
    handleToken(state,token){
      state.token = token;
      utils.setLocalStorage("token",token)
    }
  },
  actions: {
    Login(context,payload){
      return new Promise((resolve,reject)=>{
        let api = Vue.prototype.$http.api.auth.login(
          payload.username,payload.password
        );
        console.log(Vue.prototype.$http)
        Vue.prototype.$http.callapi(api).then(res=>{
          context.commit("handleToken",res.data);
          console.log(res)
          resolve(res)
        }).catch(reject)
      })
    }
  },
  modules: {

  }
})
