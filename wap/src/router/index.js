import Vue from 'vue'
import VueRouter from 'vue-router'

const cart = ()=>import ('../views/Cart');
const category = ()=>import ('../views/Category');
const home = ()=>import ('../views/Home');
const my = ()=>import ('../views/My');
const login = ()=>import ('../views/Login');
import Placeholder from '../components/Layout/Placeholder'
import Reg from "../views/Reg"
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:Placeholder,
    children:[
      {
        path:'',
        redirect:"/home"
      },
      {
        path:'home',
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
  {
    path:"/reg",
    name:'reg',
    component:Reg
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
