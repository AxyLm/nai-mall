import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "../store/index.js"

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
}

const cart = () => import('../views/Cart');
const category = () => import('../views/Category');
const home = () => import('../views/Home');
const my = () => import('../views/My');
const login = () => import('../views/Login');
import Placeholder from '../components/Layout/Placeholder'
import Reg from "../views/Reg"
import Address from "../views/Address"
import Order from "../views/Order"
import Message from "../views/Message"
import Collection from "../views/Collection"
import Discount from "../views/Discount"
import Scan from "../views/Scan"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Placeholder,
    children: [
      {
        path: '',
        redirect: "/home"
      },
      {
        path: 'home',
        component: home
      },
      {
        path: 'cart',
        name: 'cart',
        component: cart
      },
      {
        path: 'category',
        name: 'category',
        component: category
      },
      {
        path: 'my',
        name: 'my',
        component: my
      },

    ]
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: "/reg",
    name: 'reg',
    component: Reg
  },
  {
    path: "/Address",
    name: 'Address',
    component: Address
  },
  {
    path: "/Order",
    name: 'Order',
    component: Order
  },
  {
    path: "/Message",
    name: 'Message',
    component: Message
  },
  {
    path: "/Collection",
    name: 'Collection',
    component: Collection
  },
  {
    path: "/Discount",
    name: 'Discount',
    component: Discount
  },
  {
    path: "/Scan",
    name: 'Scan',
    component: Scan
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  let token = store.state.token;
  if (to.name == "Order" || to.name == "Scan" || to.name == "Discount" || to.name == "Collection" || to.name == "Message" || to.name == "Address") {
    if (!token) {
      return next({ path: "/login?back="+ to.name })
    }
  }
  next()
})

export default router
