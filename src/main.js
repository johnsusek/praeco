import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import './element-variables.scss';
import App from './App.vue';
import router from './router';
import store from './store';
import config from '../praeco.config.json';

Vue.use(ElementUI, { locale, size: 'small' });
Vue.config.productionTip = false;

axios.defaults.baseURL = config.apiBaseUrl;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
