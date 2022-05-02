import Button from "vant/lib/button";
import Popup from "vant/lib/popup";
import NavBar from "vant/lib/nav-bar";
import Tabbar from "vant/lib/tabbar";
import TabbarItem from "vant/lib/tabbar-item";
import Form from "vant/lib/form";
import Field from "vant/lib/field";
import Checkbox from "vant/lib/checkbox";
import Image from "vant/lib/image";
import Divider from "vant/lib/divider";
import Toast from "vant/lib/toast"

import "vant/lib/button/style/less";
import "vant/lib/popup/style/less";
import "vant/lib/nav-bar/style/less";
import "vant/lib/tabbar/style/less";
import "vant/lib/tabbar-item/style/less";
import "vant/lib/form/style/less";
import "vant/lib/field/style/less";
import "vant/lib/checkbox/style/less";
import "vant/lib/image/style/less";
import "vant/lib/divider/style/less";
import "vant/lib/toast/style/less";

export default {
    install(Vue){
        Vue.use(Button)
        Vue.use(Popup)
        Vue.use(NavBar)
        Vue.use(Tabbar)
        Vue.use(TabbarItem)
        Vue.use(Form)
        Vue.use(Field)
        Vue.use(Checkbox)
        Vue.use(Image)
        Vue.use(Divider)
    }
} 