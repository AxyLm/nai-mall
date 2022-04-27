import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store';

Vue.config.productionTip = false;

// 解决vue中滚轮事件报错 Added non-passive event listener to a scroll-blocking 'mousewheel' event.告警
import 'default-passive-events';

// 引入element-ui组件库
import element from "./components/element";
Vue.use(element);
import "assets/scss/base.scss";
import "assets/scss/element-reset.scss";

// 引入自定义过滤器
import filters from "./common/Filters";
Vue.use(filters);

// 引入自定义指令
import directives from "./common/Directives";
Vue.use(directives);

// 引入自定义指令
import valid from "./common/Validators";
Vue.prototype.$valid = valid;

// 引入枚举类
import enums from "./common/Enums";
Vue.prototype.$enums = enums;

// 引入工具类
import utils from './utils';
Vue.prototype.$utils = utils;

// 引入网络请求类
import request from './request';
Vue.prototype.$http = request;

// 引入全局组件
import ProgressButton from './components/progressButton/progressButton.vue';
Vue.component('ProgressButton', ProgressButton);
import File from './components/upload/File.vue';
Vue.component('File', File);
import DataTable from "./components/table/DataTable";
Vue.component('DataTable', DataTable);
import Area from "./components/area/Area";
Vue.component('Area', Area);
import Editor from "./components/editor/Editor.vue";
Vue.component('Editor', Editor);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");