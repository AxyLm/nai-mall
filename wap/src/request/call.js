import axios from "axios";
import Vue from "vue";
import store from "../store/index.js";
import {extend} from "../utils/funs/copy.js"
import {isEmpty} from "../utils/funs/types.js"

/*
* 加载中动画
*/
let counter = 0;
let loadingIns = null;
function showLoading(){
    if(counter==0){
        loadingIns = Vue.prototype.$toast.loading({
            duration: 0,
            message:'登录成功',
            loadingType: 'spinner',
        });
    }
    counter++;
}
function hideLoading(){
    counter--;
    if (counter == 0) {
        loadingIns.clear();
        loadingIns = null;
    }
}

let instance = axios.create();

/*
        请求拦截器
*/
instance.interceptors.request.use(config => {
    showLoading();
    return config;
}, err => {
    hideLoading();
    return Promise.reject(err);
});

/*
    * 响应拦截器
    * 后台接口返回的http状态码，只有两种：
    * 1）200(完成一次数据交互，无论成功或失败)，走响应成功拦截器
    * 2）401(令牌过期)，走响应错误拦截器
    * 那么如何区分一次http状态为200的数据交互的结果，是成功或失败？ res.data.meta.status
    * 1）200-300之间，代表交互成功，把数据交给外部调用者的then
    * 2）其他状态，代表交互失败，把失败信息reject给call方法内部的catch统一进行错误处理
    */
instance.interceptors.response.use(res => {
    hideLoading();
    let status = res.data.meta.status;
    if(status&&status>=200&&status<300){
        return res.data;
    }else{
        return Promise.reject(new Error(res.data.meta.msg ));
    }
},err => {
    hideLoading();
    let code = err.response && err.response.status;
    if (code == 401) {
        // 刷新token操作
        Vue.prototype.$toast.fail("token失效了,请重新登录。");
        store.commit("handleLogout");
    }else{
        return Promise.reject(err);
    }
});
    

export default function (api,options) {
    if (!api) {
        throw new Error("未提供有效的api信息");
    }
    // 默认参数,api参数及用户参数合并
    let defaults = {
        baseURL: "http://localhost:8888/api/front",
        url: '',
        method: 'get',
        data: null,
        params: null,
        timeout: '15000',
        headers: { },
        hasToken: true
    }
    extend(defaults,api,options);
    // 给请求加上时间戳,防止缓存
    if (defaults.url.indexOf('?') > -1) {
        defaults.url += "&t=" + new Date().getTime();
    } else {
        defaults.url += "?t=" + new Date().getTime();
    } 
    // 请求头携带token
    let _token = store.state.token;
    if (defaults.hasToken && !isEmpty(_token)) {
        defaults.headers.Authorization = _token.access_token;
    }
    // 发起请求
   // 1）全局捕获错误并统一处理（消息提示）
   // 2）把错误交给外部调用者的catch做个性处理
   return instance(defaults).catch(err=>{
       Vue.prototype.$toast.fail(err.message || "错啦！");
       return Promise.reject(err);
   });
}