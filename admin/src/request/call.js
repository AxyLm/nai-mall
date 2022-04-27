import Vue from "vue";
import axios from "axios";
import store from '../store/index';
import router from '../router/index';
import { extend } from '../utils/funs/copy';
import { isEmpty } from '../utils/funs/types';
import config from '../config';
let isRefreshToken = false;
let refreshReqArr = [];
/*
 * 加载中动画
 */
let counter = 0;
let loadingIns = null;
function showLoading(){
    if(counter==0){
        loadingIns = Vue.prototype.$loading({
            background:"rgba(0,0,0,0.5)"
        });
    }
	counter++;
}
function hideLoading(){
	counter--;
	if (counter == 0) {
        loadingIns.close();
		loadingIns = null;
	}
}
/*
* 请求拦截器
*/
let instance = axios.create();
instance.interceptors.request.use(config => {
    showLoading();
    return config;
}, err => {
    hideLoading();
    return Promise.reject(err);
});

/*
 * 响应拦截器
 * 后台返回状态码，只有两种：
 * 1）200(完成一次数据交互，无论成功或失败)，走响应成功拦截器
 * 2）401(令牌过期)，走响应错误拦截器
 * 那么如何区分正常数据交互过程中的不同响应状态？ res.data.meta.status、
 * 1）200-300之间，代表交互成功，把数据交给外部调用者的then
 * 2）其他状态，代表交互失败，把失败信息reject给call方法内部的catch统一进行错误处理
 */
instance.interceptors.response.use(res => {
    hideLoading();
    let status = res.data.meta.status;
    let msg = res.data.meta.msg || "错啦！";
    if(status&&status>=200&&status<300){
        return res.data;
    }else{
        return Promise.reject(new Error(msg));
    }
},err => {
    hideLoading();
    let code = err.response && err.response.status;
    if (code == 401) {
        // 过期请求进来，判断是否正在刷新token
        if (!isRefreshToken) {
            isRefreshToken = true;
            // 如果没刷新，调用刷新token接口,
            store.dispatch("GetRefreshToken",{
                success:token=>{
                    // 刷新成功，循环过期请求队列，继续发起接口请求
                    refreshReqArr.forEach(cb=>cb(token));
                    refreshReqArr = [];
                    isRefreshToken = false;
                },
                error:err=>{
                    // 刷新失败，跳转到登录页
                    isRefreshToken = false;
                    router.replace('/login');
                }
            });
        } 
        // 所有过期请求，放进一个队列
        if (isRefreshToken) {
            // 返回一个promise，让过期请求处于等待中
            return new Promise(resolve=>{
                refreshReqArr.push(token=>{
                    err.config.headers.Authorization = token.access_token;
                    // 继续发起请求，触发过期请求的回调
                    resolve(instance(err.config))
                });
            });
        }
    }else{
        return Promise.reject(err);
    }
});
/*
 * 接口请求方法
 */ 
export default function call(api, options) {
    if (!api) {
        throw new Error("未提供有效的api信息");
    }
    // 默认参数,api参数及用户参数合并
    let defaults = {
        baseURL: config._API_URL,
        url: '',
        method: 'get',
        data: null,
        params: null,
        timeout: '15000',
        headers: { },
        hasToken: true
    }
    extend(defaults, api, options);
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
        Vue.prototype.$message.error(err);
        return Promise.reject(err);
    });
}