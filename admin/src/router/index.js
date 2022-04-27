import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter);

const Layout = () => import("views/layout/Layout.vue");
const LayoutEmpty = () => import("views/layout/LayoutEmpty.vue");
const Login = () => import("views/login/Login.vue");
const Manager = () => import("views/manager/Manager.vue");
const Member = () => import("views/member/Member.vue");
const Roles = () => import("views/roles/Roles.vue");
const Rights = () => import("views/rights/Rights.vue");
const Profile = () => import("views/profile/Profile.vue");
const Good = () => import("views/good/Good.vue");
const GoodAttr = () => import("views/good_attr/GoodAttr.vue");
const GoodCat = () => import("views/good_cat/GoodCat.vue");
const Banner = () => import("views/banner/Banner.vue");
const Order = () => import("views/order/Order.vue");
const Comment = () => import("views/comment/Comment.vue");
const Config = () => import("views/config/Config.vue");
const Store = () => import("views/config/Store.vue");
const Pay = () => import("views/config/Pay.vue");
const Freight = () => import("views/config/Freight.vue");

const routes = [
	{ path: "/", redirect: "/users/managers" },
	{ path: "/login", component: Login, name: "login" },
	{ path: "/users", component: Layout, meta: { title: "用户管理" }, children: [
		{
			path: "managers", name: 'managers', component: Manager, meta: { title: "管理员" },
		},
		{
			path: "members", name: 'members', component: Member, meta: { title: "会员" },
		},
		{
			path: "profile", name: 'profile', component: Profile, meta: { title: "个人资料" }
		}
	]},
	{ path: "/permissions", component: Layout, meta: { title: "权限管理" }, children: [
		{
			path: "roles", name: 'roles', component: Roles, meta: { title: "角色列表" }
		},
		{
			path: "rights", name: 'rights', component: Rights, meta: { title: "权限列表" }
		}
	]},
	{ path: "/good", component: Layout, meta: { title: "商品管理" }, children: [
		{
			path: "list", name: 'good_list', component: Good, meta: { title: "商品列表" }
		},
		{
			path: "attr", name: 'attr', component: GoodAttr, meta: { title: "分类参数" }
		},
		{
			path: "cat", name: 'cat', component: GoodCat, meta: { title: "商品分类" }
		},
		{
			path: "banner", name: 'banner', component: Banner, meta: { title: "轮播图" }
		}
	]},
	{ path: "/order", component: Layout, meta: { title: "订单管理" }, children: [
		{
			path: "list", name: 'order_list', component: Order, meta: { title: "订单列表" }
		},
		{
			path: "comment", name: 'comment_list', component: Comment, meta: { title: "评价列表" }
		}
	]},
	{ path: "/system", component: Layout, meta: { title: "系统配置" }, children: [
		{
			path: "config", name: 'config', component: Config, meta: { title: "公共配置" }
		},
		{
			path: "store", name: 'store', component: Store, meta: { title: "门店配置" }
		},
		{
			path: "pay", name: 'pay', component: Pay, meta: { title: "支付方式" }
		},
		{
			path: "freight", name: 'freight', component: Freight, meta: { title: "运费模板" }
		},
	]},
	{ path: '/*', name: 'notFound', redirect: '/' }
];
const router = new VueRouter({
	mode: "history",
	base: process.env.VUE_APP_ROUTER_BASE_URL,
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.name != "login" && !store.state.token) {
		next("login");
	} else {
		next();
	}
});

export default router;
