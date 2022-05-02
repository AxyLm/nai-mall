import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引用自定义全局方法
import validators from "./common/Validators";
Vue.prototype.$valid = validators

import layout from './components/Layout/index.vue'
Vue.component('layout',layout)
// import "vant/lib/index.less"
// import Vant from "vant"
// import 'vant/lib/index.css'
// Vue.use(Vant)

import MyVant from "./components/vant/index"
Vue.use(MyVant)

// import 'vant/lib/button/style/less';

import "./assets/css/base.css"
import "./assets/css/font-awesome.css"
import "./assets/js/flexible.js"
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
