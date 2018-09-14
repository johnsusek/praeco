import Vue from 'vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import './element-variables.scss';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(ElementUI, { locale, size: 'small' });
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
