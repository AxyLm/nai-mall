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
import Icon from "vant/lib/icon"
import Cell from "vant/lib/cell"
import Row from "vant/lib/row"
import Col from "vant/lib/col"
import Dialog from "vant/lib/dialog"
import Search from "vant/lib/search"
import Swipe from "vant/lib/swipe"
import SwipeItem from "vant/lib/swipe-item"
import Grid from "vant/lib/grid"
import GridItem from "vant/lib/grid-item"
import List from "vant/lib/list"


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
import "vant/lib/icon/style/less";
import "vant/lib/cell/style/less";
import "vant/lib/row/style/less";
import "vant/lib/col/style/less";
import "vant/lib/dialog/style/less";
import "vant/lib/search/style/less";
import "vant/lib/swipe/style/less";
import "vant/lib/swipe-item/style/less";
import "vant/lib/grid/style/less";
import "vant/lib/grid-item/style/less";
import "vant/lib/list/style/less";

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
        Vue.use(Toast)
        Vue.use(Icon)
        Vue.use(Cell)
        Vue.use(Row)
        Vue.use(Col)
        Vue.use(Dialog)
        Vue.use(Search)
        Vue.use(Swipe)
        Vue.use(SwipeItem)
        Vue.use(Grid)
        Vue.use(GridItem)
        Vue.use(List)
    }
} 