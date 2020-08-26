import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './css/global.css'
import Cookies from 'js-cookie'
router.beforeEach( (to,from,next)=>{
  debugger
  if( to.path !="/login" && !Cookies.get('token')){
    location.href = "/login"
  }else{
    next()
  }
})
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
