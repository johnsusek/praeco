import { createApp } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import Prism from 'vue-prism-component';
import Treeselect from '@riophae/vue-treeselect';
import ElementPlus from 'element-plus';
import 'prismjs';
// import locale from 'element-plus/lib/locale/lang/en';
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
import 'element-plus/lib/theme-chalk/index.css';
import 'normalize.css';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-yaml.min.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

import ECharts from 'vue-echarts';

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

const app = createApp();
app.use(ElementPlus, { size: 'mini' });

app.component('VChart', ECharts);
app.component('Icon', FontAwesomeIcon);
app.component('VueJsonPretty', VueJsonPretty);
app.component('Prism', Prism);
app.component('Treeselect', Treeselect);
