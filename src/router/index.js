import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/home'
import Login from '../views/login'
import Register from '../views/register'
import Register_1 from '../views/register/register-one'
import Register_2 from '../views/register/register-two'
import Pinfo from '../views/pMessage'
import Center from  '../views/pCenter'
import Work from '../views/work'
import MWork from '../views/mwork'
import Order from '../views/order'
import Purse from '../views/purse'
import Auction from '../views/auction'
import pAuction from '../views/pAuction'
import wAuction from '../views/wAuction'
import Tips from '../views/tidings'
Vue.use(Router);

//解决路由重定向发生 Redirected when going from "/home" to "/logout" via a navigation guard 错误
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
export default new Router({
  mode:'history',
  routes:[
    {
      //路由路径
      path:'/Login',
      //路由名称
      name:'Login',
      //路由标签
      component:Login
    },
    {
      path:'/register',
      name:'Register',
      component:Register,
      children:[
        {
          path:'/re_one',
          name:'re_one',
          component:Register_1
        },
        {
          path:'/re_two',
          name:'re_two',
          component:Register_2
        }
      ]
    },
    {
      path:'/center',
      name:'center',
      component:Center,
      children: [
        {
          path:'/pAuction',
          name:'pAuction',
          component:pAuction
        },
        {
          path:'/tips',
          name:'Tips',
          component:Tips
        },
        {
          path:'/wAuction',
          name:'wAuction',
          component:wAuction
        },
        {
          path:'/info',
          name:'info',
          component:Pinfo
        },
        {
          path:'/work/:index',
          name:'work',
          component:Work,
          props:true
        },
        {
          path:'/mwork/:index',
          name:'MWork',
          component:MWork,
          props: true
        },
        {
          path:'/order/:index',
          name:'Order',
          component:Order,
          props:true
        },
        {
          path:'/purse',
          name:'Purse',
          component:Purse
        },
        {
          path:'/auction',
          name:'Auction',
          component:Auction
        }
      ]
    },
    {
      path:"/*",
      name:'Home',
      component:Home,
    },
  ],
})
