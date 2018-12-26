import Vue from 'vue';
import { Notification } from 'element-ui';
import axios from 'axios';
import VueNativeSock from 'vue-native-websocket';
import VueSplit from 'vue-split-panel';
import '@/contrib.js';
import '@/registration.js';
import '@/lib/string.js';
import { initLogging, logger } from './lib/logger.js';
import App from './App.vue';
import router from './router';
import store from './store';

import './style/style.scss';
import './style/spacing.scss';
import './style/tree.scss';
import './style/icons.scss';
import './style/query-builder.scss';
import './style/element.scss';
import './style/pop-trigger.scss';

Vue.use(VueSplit);

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

function startApp(config) {
  store.commit('appconfig/SET_APP_CONFIG', config);

  initLogging();

  Vue.use(
    VueNativeSock,
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${
      window.location.port
    }/api-ws/test`,
    {
      connectManually: true,
      format: 'json'
    }
  );

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
}

// First get the config from the server
// In development this will be in /public and served by webpack
// In prod it is linked into the docker container
axios
  .get('/praeco.config.json')
  .then(res => {
    startApp(res.data);
  })
  .catch(() => {
    alert('praeco.config.json missing');
  });
