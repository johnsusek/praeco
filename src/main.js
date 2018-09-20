import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import VueJsonPretty from 'vue-json-pretty';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import './element-variables.scss';
import App from './App.vue';
import DefinitionTable from './components/DefinitionTable';
import TableRow from './components/TableRow';
import Time from './components/Time';
import ConfigView from './components/ConfigView.vue';
import ConfigViewSettings from './components/ConfigViewSettings';
import ConfigViewQuery from './components/ConfigViewQuery';
import ConfigViewAlert from './components/ConfigViewAlert';
import PraecoFormItem from './components/PraecoFormItem';
import router from './router';
import store from './store';

Vue.use(ElementUI, { locale, size: 'mini' });
Vue.config.productionTip = false;

Vue.component('vue-json-pretty', VueJsonPretty);
Vue.component('ConfigView', ConfigView);
Vue.component('DefinitionTable', DefinitionTable);
Vue.component('TableRow', TableRow);
Vue.component('Time', Time);
Vue.component('ConfigViewSettings', ConfigViewSettings);
Vue.component('ConfigViewQuery', ConfigViewQuery);
Vue.component('ConfigViewAlert', ConfigViewAlert);
Vue.component('PraecoFormItem', PraecoFormItem);

// First get the config from the server
// In development this will be in /public and served by webpack
// In prod it is linked into the docker container
axios
  .get('/praeco.config.json')
  .then(res => {
    let config = res.data;

    // put the config into the store for use elsewhere in the app
    store.commit('config/SET_CONFIG', config);

    // then set the axios default to the api
    axios.defaults.baseURL = config.apiBaseUrl;

    // then start the app
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  })
  .catch(() => {
    alert('praeco.config.json missing');
  });
