import Vue from 'vue';
import ElementUI, { Notification } from 'element-ui';
import axios from 'axios';
import VueJsonPretty from 'vue-json-pretty';
import VueNativeSock from 'vue-native-websocket';
import Prism from 'vue-prism-component';
import 'prismjs';
import 'prismjs/themes/prism.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFolder, faFolderOpen, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import locale from 'element-ui/lib/locale/lang/en';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import EventTable from '@/components/EventTable';
import './element-variables.scss';

import App from './App.vue';
import PraecoInputNumber from './components/PraecoInputNumber';
import TableRow from './components/TableRow';
import Time from './components/Time';
import NavTree from './components/NavTree';
import DefinitionTable from './components/DefinitionTable';
import Bulb from './components/Bulb';
import ConfigView from './components/ConfigView.vue';
import ConfigViewSettings from './components/ConfigViewSettings';
import ConfigViewQuery from './components/ConfigViewQuery';
import ConfigViewMatch from './components/ConfigViewMatch';
import ConfigViewAlert from './components/ConfigViewAlert';
import PraecoFormItem from './components/PraecoFormItem';
import ExpandableAlert from './components/ExpandableAlert';
import ESChart from './components/ESChart';
import FolderTree from './components/FolderTree';
import ElastalertTimePicker from './components/ElastalertTimePicker';
import router from './router';
import store from './store';
import { initLogging, logger } from './lib/logger.js';

let ECharts = require('vue-echarts');

library.add(faFolder, faFolderOpen, faExclamationCircle);

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

Vue.component('icon', FontAwesomeIcon);
Vue.component('v-chart', ECharts);
Vue.component('vue-json-pretty', VueJsonPretty);
Vue.component('prism', Prism);
Vue.component('ConfigView', ConfigView);
Vue.component('NavTree', NavTree);
Vue.component('DefinitionTable', DefinitionTable);
Vue.component('TableRow', TableRow);
Vue.component('Time', Time);
Vue.component('Treeselect', Treeselect);
Vue.component('PraecoInputNumber', PraecoInputNumber);
Vue.component('ConfigViewSettings', ConfigViewSettings);
Vue.component('Bulb', Bulb);
Vue.component('ConfigViewQuery', ConfigViewQuery);
Vue.component('ConfigViewMatch', ConfigViewMatch);
Vue.component('ConfigViewAlert', ConfigViewAlert);
Vue.component('PraecoFormItem', PraecoFormItem);
Vue.component('ExpandableAlert', ExpandableAlert);
Vue.component('EventTable', EventTable);
Vue.component('ESChart', ESChart);
Vue.component('FolderTree', FolderTree);
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
