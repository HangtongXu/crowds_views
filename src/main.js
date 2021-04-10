// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

//安装路由模块
import VueRouter from 'vue-router'
import router from './router'

//安装element-ui模块
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

//安装axios模块
import Vueaxios from 'vue-axios'
import axios from 'axios'

//引入vuex
import Vuex from 'vuex'
import store from './store'


//部署vuex模块
Vue.use(Vuex);
//部署路由模块
Vue.use(VueRouter);
//部署element-ui模块
Vue.use(ElementUI);
//部署axios模块，注意顺序
Vue.use(Vueaxios,axios);

Vue.config.productionTip = false;


Vue.prototype.$ajax = axios;


//配置路径访问，to：到那里去  from：从哪里来  next:下一个路径
router.beforeEach((to,from,next)=>{
  let isLogin = sessionStorage.getItem('crowd_user');

  if(to.path == '/logout'){
    sessionStorage.clear();
    next({path:'/Login'});
  }

  else if(to.path == '/Login'){
    if(isLogin != null){
      next({path:'/'})
    }
  }
  // else  if(to.path == '/home'){
  //   if(isLogin == null){
  //     next({path:'/Login'})
  //   }
  // }

  next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>',
  mounted(){
    window.addEventListener('unload',this.saveState)
  },
  methods:{
    saveState(){
      if(sessionStorage.getItem('crowd_user')!=null){

        sessionStorage.setItem('state', JSON.stringify(this.$store.state));
      }
    }
  }
})
