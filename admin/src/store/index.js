import Vue from "vue";
import Vuex from "vuex";
import utils from "../utils";
import config from "../config";
// 向vue全局注入操作vuex的方法
Vue.use(Vuex);
// 创建全局共享状态的存储容器
const store = new Vuex.Store({
    state: {
        me: utils.getLocalStorage(config._ME_KEY) || {},
        token: utils.getLocalStorage(config._TOKEN_KEY) || "",
        menus: utils.getLocalStorage(config._MENUS_KEY) || [],
        rights: utils.getLocalStorage(config._RIGHTS_KEY),
        menuFolded: false,
        btndDatas: null,
    },
    mutations: {
        handleToken(state, token) {
            state.token = token;
            utils.setLocalStorage(config._TOKEN_KEY, token);
        },
        handleMe(state, me) {
            state.me = me;
            utils.setLocalStorage(config._ME_KEY, me);
        },
        handleMenus(state, menus){
            state.menus = menus;
            utils.setLocalStorage(config._MENUS_KEY, menus);
        },
        handleMyRights(state, rights){
            state.rights = rights;
            utils.setLocalStorage(config._RIGHTS_KEY, rights);
        },
        handleLogout(state) {
            state.token = "";
            state.me = null;
            utils.removeLocalStorage(config._ME_KEY);
            utils.removeLocalStorage(config._TOKEN_KEY);
            utils.removeLocalStorage(config._MENUS_KEY);
            utils.removeLocalStorage(config._RIGHTS_KEY);
        },
        changeMenuFolded(state, folded) {
            state.menuFolded = folded;
        },
        handleBtnDatas(state, datas) {
            state.btndDatas = datas;
        }
    },
    actions: {
        Login(context, payload) {
            return new Promise((resolve,reject)=>{
                let api = Vue.prototype.$http.api.auth.login(payload.username, payload.password);
                Vue.prototype.$http.callApi(api).then(res => {
                    context.commit("handleToken", res.data);
                    Promise.all([
						context.dispatch("GetMe"),
						context.dispatch("GetMenus"),
						context.dispatch("GetMyRights")
					]).then(resolve).catch(reject);
                }).catch(reject);
            });
        },
        GetMe(context, payload){
            return new Promise((resolve,reject)=>{
                let api = Vue.prototype.$http.api.managers.getMe();
                Vue.prototype.$http.callApi(api).then(res => {
                    context.commit("handleMe", res.data);
                    resolve(res.data);
                }).catch(reject);
            });
        },
        GetMenus(context, payload){
            return new Promise((resolve,reject)=>{
                let api = Vue.prototype.$http.api.permission.menus();
                Vue.prototype.$http.callApi(api).then(res => {
                    context.commit("handleMenus", res.data);
                    resolve(res.data);
                }).catch(reject);
            });
        },
        GetMyRights(context, payload){
            return new Promise((resolve,reject)=>{
                let api = Vue.prototype.$http.api.permission.getMyRights();
                Vue.prototype.$http.callApi(api).then(res => {
                    context.commit("handleMyRights", res.data);
                    resolve(res.data);
                }).catch(reject);
            });
        },
        GetRefreshToken(context, payload){
            let refreshToken = context.state.token.refresh_token;
            let api = Vue.prototype.$http.api.auth.refresh(refreshToken);
            Vue.prototype.$http.callApi(api).then(res => {
                context.commit("handleToken",res.data);
                payload.success && payload.success(res.data);
            }).catch(err=>{
                context.commit('handleLogout');
                payload.error && payload.error();
            });
        },
    },
    getters: {},
    modules: {}
});
// 导出全局共享状态的存储容器
export default store;