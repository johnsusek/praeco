import Vue from 'vue';
import ElementUI, { Notification } from 'element-ui';
import axios from 'axios';
import VueJsonPretty from 'vue-json-pretty';
import VueNativeSock from 'vue-native-websocket';
import 'prismjs';
import 'prismjs/themes/prism.css';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import './element-variables.scss';
import App from './App.vue';
import TableRow from './components/TableRow';
import Time from './components/Time';
import DefinitionTable from './components/DefinitionTable';
import ConfigView from './components/ConfigView.vue';
import ConfigViewSettings from './components/ConfigViewSettings';
import ConfigViewQuery from './components/ConfigViewQuery';
import ConfigViewMatch from './components/ConfigViewMatch';
import ConfigViewAlert from './components/ConfigViewAlert';
import PraecoFormItem from './components/PraecoFormItem';
import ExpandableAlert from './components/ExpandableAlert';
import ESChart from './components/ESChart';
import ElastalertTimePicker from './components/ElastalertTimePicker';
import router from './router';
import store from './store';
import { initLogging, logger } from './lib/logger.js';

let ECharts = require('vue-echarts');

Vue.use(ElementUI, { locale, size: 'mini' });

Vue.config.productionTip = false;

Vue.config.errorHandler = function(err, vm, info) {
  logger().error(err);
  console.error(err, vm, info);
  Notification.error({
    message: err.toString(),
    title: 'Internal error',
    duration: 0
  });
};

Vue.component('v-chart', ECharts);
Vue.component('vue-json-pretty', VueJsonPretty);
Vue.component('ConfigView', ConfigView);
Vue.component('DefinitionTable', DefinitionTable);
Vue.component('TableRow', TableRow);
Vue.component('Time', Time);
Vue.component('ConfigViewSettings', ConfigViewSettings);
Vue.component('ConfigViewQuery', ConfigViewQuery);
Vue.component('ConfigViewMatch', ConfigViewMatch);
Vue.component('ConfigViewAlert', ConfigViewAlert);
Vue.component('PraecoFormItem', PraecoFormItem);
Vue.component('ExpandableAlert', ExpandableAlert);
Vue.component('ESChart', ESChart);
Vue.component('ElastalertTimePicker', ElastalertTimePicker);

// First get the config from the server
// In development this will be in /public and served by webpack
// In prod it is linked into the docker container
axios
  .get('/praeco.config.json')
  .then(res => {
    let config = res.data;

    // put the config into the store for use elsewhere in the app
    store.commit('config/SET_CONFIG', config);

    initLogging();

    // then set the axios default to the api
    axios.defaults.baseURL = config.apiBaseUrl;

    Vue.use(VueNativeSock, `${config.apiWsBaseUrl}/test`, {
      connectManually: true,
      format: 'json'
    });

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
