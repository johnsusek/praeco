import { createApp } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import Prism from 'vue-prism-component';
import infiniteScroll from 'vue3-infinite-scroll-good';
import Treeselect from 'vue3-treeselect';
import ElementPlus from 'element-plus';
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
import 'element-plus/dist/index.css';
import 'normalize.css';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-yaml.min.js';
import 'vue3-treeselect/dist/vue3-treeselect.css';

import ECharts from 'vue-echarts';

const app = createApp({});

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
