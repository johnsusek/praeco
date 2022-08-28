import { createApp } from 'vue';

import VueJsonPretty from 'vue-json-pretty';
import Prism from 'vue-prism-component';
import infiniteScroll from 'vue3-infinite-scroll-good';
import Treeselect from '@tanbo800/vue3-treeselect';
import ElementPlus, { ElNotification } from 'element-plus';
import 'prismjs';
import locale from 'element-plus/lib/locale/lang/en';
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
// import 'element-plus/lib/theme-chalk/index.css'; // TODO:
import 'element-plus/dist/index.css';
import 'normalize.css';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-yaml.min.js';
import '@tanbo800/vue3-treeselect/dist/vue3-treeselect.css';

import ECharts from 'vue-echarts';

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
import ConfigAlertGitter from '@/components/config/alert/ConfigAlertGitter.vue';
import ConfigAlertGoogleChat from '@/components/config/alert/ConfigAlertGoogleChat.vue';
import ConfigAlertHttpPost from '@/components/config/alert/ConfigAlertHttpPost.vue';
import ConfigAlertHttpPost2 from '@/components/config/alert/ConfigAlertHttpPost2.vue';
import ConfigAlertJira from '@/components/config/alert/ConfigAlertJira.vue';
import ConfigAlertLineNotify from '@/components/config/alert/ConfigAlertLineNotify.vue';
import ConfigAlertMattermost from '@/components/config/alert/ConfigAlertMattermost.vue';
import ConfigAlertMsTeams from '@/components/config/alert/ConfigAlertMsTeams.vue';
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
import ConfigAlertVictorOps from '@/components/config/alert/ConfigAlertVictorOps.vue';
import ConfigAlertZabbix from '@/components/config/alert/ConfigAlertZabbix.vue';
import ConfigKibanaDiscover from '@/components/config/ConfigKibanaDiscover.vue';
import ConfigTimeWindowFeature from '@/components/config/ConfigTimeWindowFeature.vue';
import ConfigOwner from '@/components/config/ConfigOwner.vue';
import ConfigPriority from '@/components/config/ConfigPriority.vue';
import ConfigDescription from '@/components/config/ConfigDescription.vue';
import ConfigSettings from '@/components/config/ConfigSettings.vue';
import ConfigCondition from '@/components/config/ConfigCondition.vue';
import ConfigScanEntireTimeframe from '@/components/config/ConfigScanEntireTimeframe.vue';
// import ConfigLimitExcecution from '@/components/config/ConfigLimitExcecution.vue'; // TODO:

import axios from 'axios';
import VueNativeSock from 'vue-native-websocket-vue3';
import VueSplit from 'vue3-split-panel';
// import '@/contrib.js'; // TODO:
// import '@/registration.js'; // TODO:
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

const app = createApp(App);

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

app.use(ElementPlus, { locale, size: 'mini' });
app.use(infiniteScroll);

app.component('VChart', ECharts);
app.component('Icon', FontAwesomeIcon);
app.component('VueJsonPretty', VueJsonPretty);
app.component('Prism', Prism);
app.component('Treeselect', Treeselect);

app.component('Bulb', Bulb);
app.component('DateTime', DateTime);
app.component('ConfigQuery', ConfigQuery);
app.component('ConfigAlert', ConfigAlert);
app.component('ConfigAlertAlerta', ConfigAlertAlerta);
app.component('ConfigAlertAlertmanager', ConfigAlertAlertmanager);
app.component('ConfigAlertAmazonSes', ConfigAlertAmazonSes);
app.component('ConfigAlertAmazonSns', ConfigAlertAmazonSns);
app.component('ConfigAlertChatwork', ConfigAlertChatwork);
app.component('ConfigAlertCommand', ConfigAlertCommand);
app.component('ConfigAlertDatadog', ConfigAlertDatadog);
app.component('ConfigAlertDingtalk', ConfigAlertDingtalk);
app.component('ConfigAlertDiscord', ConfigAlertDiscord);
app.component('ConfigAlertEmail', ConfigAlertEmail);
app.component('ConfigAlertExotel', ConfigAlertExotel);
app.component('ConfigAlertGitter', ConfigAlertGitter);
app.component('ConfigAlertGoogleChat', ConfigAlertGoogleChat);
app.component('ConfigAlertHttpPost', ConfigAlertHttpPost);
app.component('ConfigAlertHttpPost2', ConfigAlertHttpPost2);
app.component('ConfigAlertJira', ConfigAlertJira);
app.component('ConfigAlertLineNotify', ConfigAlertLineNotify);
app.component('ConfigAlertMattermost', ConfigAlertMattermost);
app.component('ConfigAlertMsTeams', ConfigAlertMsTeams);
app.component('ConfigAlertPagerDuty', ConfigAlertPagerDuty);
app.component('ConfigAlertPagerTree', ConfigAlertPagerTree);
app.component('ConfigAlertRocketChat', ConfigAlertRocketChat);
app.component('ConfigAlertServiceNow', ConfigAlertServiceNow);
app.component('ConfigAlertSlack', ConfigAlertSlack);
app.component('ConfigAlertStomp', ConfigAlertStomp);
app.component('ConfigAlertTencentSms', ConfigAlertTencentSms);
app.component('ConfigAlertTelegram', ConfigAlertTelegram);
app.component('ConfigAlertTheHive', ConfigAlertTheHive);
app.component('ConfigAlertTwilio', ConfigAlertTwilio);
app.component('ConfigAlertVictorOps', ConfigAlertVictorOps);
app.component('ConfigAlertZabbix', ConfigAlertZabbix);
app.component('ConfigAggregation', ConfigAggregation);
app.component('ConfigSettings', ConfigSettings);
app.component('ConfigKibanaDiscover', ConfigKibanaDiscover);
app.component('ConfigTimeWindowFeature', ConfigTimeWindowFeature);
app.component('ConfigOwner', ConfigOwner);
app.component('ConfigPriority', ConfigPriority);
app.component('ConfigDescription', ConfigDescription);
app.component('ConfigCondition', ConfigCondition);
app.component('ConfigScanEntireTimeframe', ConfigScanEntireTimeframe);
// app.component('ConfigLimitExcecution', ConfigLimitExcecution); // TODO:
app.component('DefinitionTable', DefinitionTable);
app.component('ElastalertTimePicker', ElastalertTimePicker);
app.component('ESChart', ESChart);
app.component('EventTable', EventTable);
app.component('ExpandableAlert', ExpandableAlert);
app.component('FolderTree', FolderTree);
app.component('NavTree', NavTree);
app.component('PraecoFormItem', PraecoFormItem);
app.component('TableRow', TableRow);
app.component('ElastalertTimeView', ElastalertTimeView);

app.use(VueSplit);

app.config.errorHandler = function(err, vm, info) {
  logger().error(err);

  console.error(err, vm, info);

  ElNotification.error({
    message: err.toString(),
    title: 'Internal error',
    duration: 0
  });
};

function startApp(config) {
  store.commit('appconfig/SET_APP_CONFIG', config);

  initLogging();

  app.use(
    VueNativeSock,
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${
      window.location.port
    }/api-ws/test`,
    {
      connectManually: true,
      format: 'json'
    }
  );

  app.use(router);
  app.use(store);
  app.mount('#app');
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
