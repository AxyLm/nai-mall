import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vant from "vant"
import 'vant/lib/index.css'
Vue.use(Vant)

import "./assets/css/base.css"
import "./assets/css/font-awesome.css"
import "./assets/js/flexible.js"
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
