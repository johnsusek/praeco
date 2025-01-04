import Vue from 'vue';
import ElementUI, { Notification } from 'element-ui';
import axios from 'axios';
import VueNativeSock from 'vue-native-websocket';
import VueSplit from 'vue-split-panel';
import VueJsonPretty from 'vue-json-pretty';
import Prism from 'vue-prism-component';
import Treeselect from '@riophae/vue-treeselect';
import 'prismjs';
import locale from 'element-ui/lib/locale/lang/en';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBell,
  faChevronDown,
  faChevronUp,
  faEllipsisH,
  faEnvelope,
  faGlobe,
  faFile,
  faFileAlt,
  faFolder,
  faFolderOpen,
  faQuestionCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  faSlack, faMicrosoft, faGitter, faAws, faLine, faTelegram, faJira, faRocketchat
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-yaml.min.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import ECharts from 'vue-echarts';

import cronLight from '@vue-js-cron/light';
import Bulb from '@/components/Bulb';
import DateTime from '@/components/DateTime';
import DefinitionTable from '@/components/DefinitionTable';
import ElastalertTimePicker from '@/components/ElastalertTimePicker';
import ESChart from '@/components/ESChart';
import EventTable from '@/components/EventTable';
import ExpandableAlert from '@/components/ExpandableAlert';
import FolderTree from '@/components/FolderTree';
import NavTree from '@/components/NavTree';
import PraecoFormItem from '@/components/PraecoFormItem';
import TableRow from '@/components/TableRow';
import ElastalertTimeView from '@/components/ElastalertTimeView';
import ConfigQuery from '@/components/config/ConfigQuery.vue';
import ConfigAggregation from '@/components/config/ConfigAggregation.vue';
import ConfigAlert from '@/components/config/alert/ConfigAlert.vue';
import ConfigAlertAlerta from '@/components/config/alert/ConfigAlertAlerta.vue';
import ConfigAlertAlertmanager from '@/components/config/alert/ConfigAlertAlertmanager.vue';
import ConfigAlertAmazonSes from '@/components/config/alert/ConfigAlertAmazonSes.vue';
import ConfigAlertAmazonSns from '@/components/config/alert/ConfigAlertAmazonSns.vue';
import ConfigAlertChatwork from '@/components/config/alert/ConfigAlertChatwork.vue';
import ConfigAlertCommand from '@/components/config/alert/ConfigAlertCommand.vue';
import ConfigAlertDatadog from '@/components/config/alert/ConfigAlertDatadog.vue';
import ConfigAlertDingtalk from '@/components/config/alert/ConfigAlertDingtalk.vue';
import ConfigAlertDiscord from '@/components/config/alert/ConfigAlertDiscord.vue';
import ConfigAlertEmail from '@/components/config/alert/ConfigAlertEmail.vue';
import ConfigAlertExotel from '@/components/config/alert/ConfigAlertExotel.vue';
import ConfigAlertGelf from '@/components/config/alert/ConfigAlertGelf.vue';
import ConfigAlertGitter from '@/components/config/alert/ConfigAlertGitter.vue';
import ConfigAlertGoogleChat from '@/components/config/alert/ConfigAlertGoogleChat.vue';
import ConfigAlertHttpPost from '@/components/config/alert/ConfigAlertHttpPost.vue';
import ConfigAlertHttpPost2 from '@/components/config/alert/ConfigAlertHttpPost2.vue';
import ConfigAlertIris from '@/components/config/alert/ConfigAlertIris.vue';
import ConfigAlertJira from '@/components/config/alert/ConfigAlertJira.vue';
import ConfigAlertLark from '@/components/config/alert/ConfigAlertLark.vue';
import ConfigAlertMattermost from '@/components/config/alert/ConfigAlertMattermost.vue';
import ConfigAlertMatrixHookshot from '@/components/config/alert/ConfigAlertMatrixHookshot.vue';
import ConfigAlertMsPowerAutomate from '@/components/config/alert/ConfigAlertMsPowerAutomate.vue';
import ConfigAlertPagerDuty from '@/components/config/alert/ConfigAlertPagerDuty.vue';
import ConfigAlertPagerTree from '@/components/config/alert/ConfigAlertPagerTree.vue';
import ConfigAlertRocketChat from '@/components/config/alert/ConfigAlertRocketChat.vue';
import ConfigAlertServiceNow from '@/components/config/alert/ConfigAlertServiceNow.vue';
import ConfigAlertSlack from '@/components/config/alert/ConfigAlertSlack.vue';
import ConfigAlertStomp from '@/components/config/alert/ConfigAlertStomp.vue';
import ConfigAlertTencentSms from '@/components/config/alert/ConfigAlertTencentSms.vue';
import ConfigAlertTelegram from '@/components/config/alert/ConfigAlertTelegram.vue';
import ConfigAlertTheHive from '@/components/config/alert/ConfigAlertTheHive.vue';
import ConfigAlertTwilio from '@/components/config/alert/ConfigAlertTwilio.vue';
import ConfigAlertOpsgenie from '@/components/config/alert/ConfigAlertOpsgenie.vue';
import ConfigAlertVictorOps from '@/components/config/alert/ConfigAlertVictorOps.vue';
import ConfigAlertWorkWeChat from './components/config/alert/ConfigAlertWorkWeChat.vue';
import ConfigAlertZabbix from '@/components/config/alert/ConfigAlertZabbix.vue';
import ConfigKibanaDiscover from '@/components/config/ConfigKibanaDiscover.vue';
import ConfigTimeWindowFeature from '@/components/config/ConfigTimeWindowFeature.vue';
import ConfigOwner from '@/components/config/ConfigOwner.vue';
import ConfigPriority from '@/components/config/ConfigPriority.vue';
import ConfigDescription from '@/components/config/ConfigDescription.vue';
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigCondition from '@/components/config/ConfigCondition.vue';
import ConfigScanEntireTimeframe from '@/components/config/ConfigScanEntireTimeframe.vue';
import ConfigLimitExcecution from '@/components/config/ConfigLimitExcecution.vue';

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
import '@vue-js-cron/light/dist/light.css';

library.add(
  faBell,
  faFile,
  faFileAlt,
  faSlack,
  faRocketchat,
  faMicrosoft,
  faGitter,
  faAws,
  faLine,
  faTelegram,
  faJira,
  faGlobe,
  faEnvelope,
  faChevronUp,
  faChevronDown,
  faEllipsisH,
  faFolder,
  faFolderOpen,
  faQuestionCircle,
  faExclamationCircle
);

Vue.use(cronLight);
Vue.use(VueSplit);

Vue.use(ElementUI, { locale, size: 'mini' });

Vue.component('VChart', ECharts);
Vue.component('Icon', FontAwesomeIcon);
Vue.component('VueJsonPretty', VueJsonPretty);
Vue.component('Prism', Prism);
Vue.component('Treeselect', Treeselect);

Vue.component('Bulb', Bulb);
Vue.component('DateTime', DateTime);
Vue.component('ConfigQuery', ConfigQuery);
Vue.component('ConfigAlert', ConfigAlert);
Vue.component('ConfigAlertAlerta', ConfigAlertAlerta);
Vue.component('ConfigAlertAlertmanager', ConfigAlertAlertmanager);
Vue.component('ConfigAlertAmazonSes', ConfigAlertAmazonSes);
Vue.component('ConfigAlertAmazonSns', ConfigAlertAmazonSns);
Vue.component('ConfigAlertChatwork', ConfigAlertChatwork);
Vue.component('ConfigAlertCommand', ConfigAlertCommand);
Vue.component('ConfigAlertDatadog', ConfigAlertDatadog);
Vue.component('ConfigAlertDingtalk', ConfigAlertDingtalk);
Vue.component('ConfigAlertDiscord', ConfigAlertDiscord);
Vue.component('ConfigAlertEmail', ConfigAlertEmail);
Vue.component('ConfigAlertExotel', ConfigAlertExotel);
Vue.component('ConfigAlertGelf', ConfigAlertGelf);
Vue.component('ConfigAlertGitter', ConfigAlertGitter);
Vue.component('ConfigAlertGoogleChat', ConfigAlertGoogleChat);
Vue.component('ConfigAlertHttpPost', ConfigAlertHttpPost);
Vue.component('ConfigAlertHttpPost2', ConfigAlertHttpPost2);
Vue.component('ConfigAlertIris', ConfigAlertIris);
Vue.component('ConfigAlertJira', ConfigAlertJira);
Vue.component('ConfigAlertLark', ConfigAlertLark);
Vue.component('ConfigAlertMattermost', ConfigAlertMattermost);
Vue.component('ConfigAlertMatrixHookshot', ConfigAlertMatrixHookshot);
Vue.component('ConfigAlertMsPowerAutomate', ConfigAlertMsPowerAutomate);
Vue.component('ConfigAlertPagerDuty', ConfigAlertPagerDuty);
Vue.component('ConfigAlertPagerTree', ConfigAlertPagerTree);
Vue.component('ConfigAlertRocketChat', ConfigAlertRocketChat);
Vue.component('ConfigAlertServiceNow', ConfigAlertServiceNow);
Vue.component('ConfigAlertSlack', ConfigAlertSlack);
Vue.component('ConfigAlertStomp', ConfigAlertStomp);
Vue.component('ConfigAlertTencentSms', ConfigAlertTencentSms);
Vue.component('ConfigAlertTelegram', ConfigAlertTelegram);
Vue.component('ConfigAlertTheHive', ConfigAlertTheHive);
Vue.component('ConfigAlertTwilio', ConfigAlertTwilio);
Vue.component('ConfigAlertOpsgenie', ConfigAlertOpsgenie);
Vue.component('ConfigAlertVictorOps', ConfigAlertVictorOps);
Vue.component('ConfigAlertWorkWeChat', ConfigAlertWorkWeChat);
Vue.component('ConfigAlertZabbix', ConfigAlertZabbix);
Vue.component('ConfigAggregation', ConfigAggregation);
Vue.component('ConfigSettings', ConfigSettings);
Vue.component('ConfigKibanaDiscover', ConfigKibanaDiscover);
Vue.component('ConfigTimeWindowFeature', ConfigTimeWindowFeature);
Vue.component('ConfigOwner', ConfigOwner);
Vue.component('ConfigPriority', ConfigPriority);
Vue.component('ConfigDescription', ConfigDescription);
Vue.component('ConfigCondition', ConfigCondition);
Vue.component('ConfigScanEntireTimeframe', ConfigScanEntireTimeframe);
Vue.component('ConfigLimitExcecution', ConfigLimitExcecution);
Vue.component('DefinitionTable', DefinitionTable);
Vue.component('ElastalertTimePicker', ElastalertTimePicker);
Vue.component('ESChart', ESChart);
Vue.component('EventTable', EventTable);
Vue.component('ExpandableAlert', ExpandableAlert);
Vue.component('FolderTree', FolderTree);
Vue.component('NavTree', NavTree);
Vue.component('PraecoFormItem', PraecoFormItem);
Vue.component('TableRow', TableRow);
Vue.component('ElastalertTimeView', ElastalertTimeView);

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
axios.defaults.baseURL = process.env.BASE_URL;
axios
  .get('/praeco.config.json')
  .then(res => {
    startApp(res.data);
  })
  .catch(() => {
    alert('praeco.config.json missing');
  });
