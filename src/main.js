import Vue from 'vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './styles/element-variables.scss'
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils.js'
// echarts
import VeLine from 'v-charts/lib/line.common';
import VeMap from 'v-charts/lib/map.common';
import HeatMap from 'v-charts/lib/heatmap.common';


// vue-quill-edit
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(ElementUI)
Vue.use(VueAxios, Axios);

[VeLine, VeMap, HeatMap].forEach(comp => {
  Vue.component(comp.name, comp);
});

router.beforeEach((to, from, next) => {

  let token = sessionStorage.getItem('token') || '';

  //配置接口信息
  // Axios.defaults.baseURL = 'http://www.地址.com:8360/admin/';
  // Axios.defaults.headers.common['X-Nideshop-Token'] = token;

  if (!token && to.name !== 'login') {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
});
Vue.config.productionTip = false
window.bus = new Vue();
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
