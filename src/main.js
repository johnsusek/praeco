import { createApp } from 'vue';
import ElementPlus, { ElNotification } from 'element-plus';
import axios from 'axios';
import WebSocketPlugin from './plugins/websocket';
import VueJsonPretty from 'vue-json-pretty';
import Prism from 'vue-prism-component';
import Treeselect from 'vue3-treeselect';
import 'prismjs';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBell,
  faChevronDown,
  faChevronUp,
  faEllipsis,
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
import 'element-plus/dist/index.css';
import 'normalize.css';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-yaml.min.js';
import 'vue3-treeselect/dist/vue3-treeselect.css';

import ECharts from 'vue-echarts';

import cronLight from '@vue-js-cron/light';
import Bulb from '@/components/Bulb.vue';
import DateTime from '@/components/DateTime.vue';
import DefinitionTable from '@/components/DefinitionTable.vue';
import ElastalertTimePicker from '@/components/ElastalertTimePicker.vue';
import ESChart from '@/components/ESChart.vue';
import EventTable from '@/components/EventTable.vue';
import ExpandableAlert from '@/components/ExpandableAlert.vue';
import FolderTree from '@/components/FolderTree.vue';
import NavTree from '@/components/NavTree.vue';
import PraecoFormItem from '@/components/PraecoFormItem.vue';
import TableRow from '@/components/TableRow.vue';
import ElastalertTimeView from '@/components/ElastalertTimeView.vue';
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
import ConfigAlertLineMessageApi from '@/components/config/alert/ConfigAlertLineMessageApi.vue';
import ConfigAlertMattermost from '@/components/config/alert/ConfigAlertMattermost.vue';
import ConfigAlertMatrixHookshot from '@/components/config/alert/ConfigAlertMatrixHookshot.vue';
import ConfigAlertMsPowerAutomate from '@/components/config/alert/ConfigAlertMsPowerAutomate.vue';
import ConfigAlertPagerDuty from '@/components/config/alert/ConfigAlertPagerDuty.vue';
import ConfigAlertPagerTree from '@/components/config/alert/ConfigAlertPagerTree.vue';
import ConfigAlertRocketChat from '@/components/config/alert/ConfigAlertRocketChat.vue';
import ConfigAlertServiceNow from '@/components/config/alert/ConfigAlertServiceNow.vue';
import ConfigAlertSlack from '@/components/config/alert/ConfigAlertSlack.vue';
import ConfigAlertSmsEagle from '@/components/config/alert/ConfigAlertSmsEagle.vue';
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
import ConfigBufferTime from '@/components/config/ConfigBufferTime.vue';
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
import { en } from 'element-plus/es/locale/index.mjs';

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
  faEllipsis,
  faFolder,
  faFolderOpen,
  faQuestionCircle,
  faExclamationCircle
);

function startApp(config) {
  const app = createApp(App);

  app.use(cronLight);

  app.use(ElementPlus, { locale: en, size: 'mini' });

  app.config.errorHandler = function(err, vm, info) {
    logger().error(err);

    console.error(err, vm, info);

    ElNotification({
      message: err.toString(),
      title: 'Internal error',
      duration: 0,
      type: 'error',
    });
  };

  store.commit('appconfig/SET_APP_CONFIG', config);

  initLogging();

  app.use(
    WebSocketPlugin,
    `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.hostname}:${
      window.location.port
    }/api-ws/test`
  );

  app.use(router).use(store);

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
  app.component('ConfigAlertGelf', ConfigAlertGelf);
  app.component('ConfigAlertGitter', ConfigAlertGitter);
  app.component('ConfigAlertGoogleChat', ConfigAlertGoogleChat);
  app.component('ConfigAlertHttpPost', ConfigAlertHttpPost);
  app.component('ConfigAlertHttpPost2', ConfigAlertHttpPost2);
  app.component('ConfigAlertIris', ConfigAlertIris);
  app.component('ConfigAlertJira', ConfigAlertJira);
  app.component('ConfigAlertLark', ConfigAlertLark);
  app.component('ConfigAlertLineMessageApi', ConfigAlertLineMessageApi);
  app.component('ConfigAlertMattermost', ConfigAlertMattermost);
  app.component('ConfigAlertMatrixHookshot', ConfigAlertMatrixHookshot);
  app.component('ConfigAlertMsPowerAutomate', ConfigAlertMsPowerAutomate);
  app.component('ConfigAlertPagerDuty', ConfigAlertPagerDuty);
  app.component('ConfigAlertPagerTree', ConfigAlertPagerTree);
  app.component('ConfigAlertRocketChat', ConfigAlertRocketChat);
  app.component('ConfigAlertServiceNow', ConfigAlertServiceNow);
  app.component('ConfigAlertSlack', ConfigAlertSlack);
  app.component('ConfigAlertSmsEagle', ConfigAlertSmsEagle);
  app.component('ConfigAlertStomp', ConfigAlertStomp);
  app.component('ConfigAlertTencentSms', ConfigAlertTencentSms);
  app.component('ConfigAlertTelegram', ConfigAlertTelegram);
  app.component('ConfigAlertTheHive', ConfigAlertTheHive);
  app.component('ConfigAlertTwilio', ConfigAlertTwilio);
  app.component('ConfigAlertOpsgenie', ConfigAlertOpsgenie);
  app.component('ConfigAlertVictorOps', ConfigAlertVictorOps);
  app.component('ConfigAlertWorkWeChat', ConfigAlertWorkWeChat);
  app.component('ConfigAlertZabbix', ConfigAlertZabbix);
  app.component('ConfigAggregation', ConfigAggregation);
  app.component('ConfigSettings', ConfigSettings);
  app.component('ConfigKibanaDiscover', ConfigKibanaDiscover);
  app.component('ConfigTimeWindowFeature', ConfigTimeWindowFeature);
  app.component('ConfigOwner', ConfigOwner);
  app.component('ConfigPriority', ConfigPriority);
  app.component('ConfigBufferTime', ConfigBufferTime);
  app.component('ConfigDescription', ConfigDescription);
  app.component('ConfigCondition', ConfigCondition);
  app.component('ConfigScanEntireTimeframe', ConfigScanEntireTimeframe);
  app.component('ConfigLimitExcecution', ConfigLimitExcecution);
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

  app.mount('#app');
}

// First get the config from the server
// In development this will be in /public and served by webpack
// In prod it is linked into the docker container
axios.get(import.meta.env.BASE_URL + 'praeco.config.json')
  .then(res => {
    console.log("CONFIG OK:", res.data);
    startApp(res.data);
  })
  .catch(err => {
    console.error("CONFIG ERROR:", err);
    alert('praeco.config.json missing');
  });
