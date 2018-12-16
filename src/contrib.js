import Vue from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import Prism from 'vue-prism-component';
import infiniteScroll from 'vue-infinite-scroll';
import Treeselect from '@riophae/vue-treeselect';
import ElementUI from 'element-ui';
import 'prismjs';
import locale from 'element-ui/lib/locale/lang/en';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faChevronUp,
  faEllipsisH,
  faEnvelope,
  faGlobe,
  faFile,
  faFileAlt,
  faFolder,
  faFolderOpen,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { faSlack } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-yaml.min.js';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

let ECharts = require('vue-echarts');

library.add(
  faFile,
  faFileAlt,
  faSlack,
  faGlobe,
  faEnvelope,
  faChevronUp,
  faChevronDown,
  faEllipsisH,
  faFolder,
  faFolderOpen,
  faExclamationCircle
);

Vue.use(ElementUI, { locale, size: 'mini' });
Vue.use(infiniteScroll);

Vue.component('v-chart', ECharts);
Vue.component('icon', FontAwesomeIcon);
Vue.component('vue-json-pretty', VueJsonPretty);
Vue.component('prism', Prism);
Vue.component('Treeselect', Treeselect);
