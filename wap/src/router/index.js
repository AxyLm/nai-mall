import Vue from 'vue'
import VueRouter from 'vue-router'

const cart = ()=>import ('../views/Cart');
const category = ()=>import ('../views/Category');
const home = ()=>import ('../views/Home');
const my = ()=>import ('../views/My');
const login = ()=>import ('../views/Login');
const layout = ()=>import ('../components/Layout');

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'layout',
    component:layout,
    children:[
      {
        path:'',
        name:'home',
        component:home
      },
      {
        path:'cart',
        name:'cart',
        component:cart
      },
      {
        path:'category',
        name:'category',
        component:category
      },
      {
        path:'my',
        name:'my',
        component:my
      },
      
    ]
  },
  {
    path:'/login',
    name:'login',
    component:login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
