import Vue from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import Prism from 'vue-prism-component';
import Treeselect from '@riophae/vue-treeselect';
import ElementUI from 'element-ui';
import 'prismjs';
import locale from 'element-ui/lib/locale/lang/en';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFolder, faFolderOpen, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css';
import 'prismjs/themes/prism.css';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

let ECharts = require('vue-echarts');

library.add(faFolder, faFolderOpen, faExclamationCircle);

Vue.use(ElementUI, { locale, size: 'mini' });

Vue.component('v-chart', ECharts);
Vue.component('icon', FontAwesomeIcon);
Vue.component('vue-json-pretty', VueJsonPretty);
Vue.component('prism', Prism);
Vue.component('Treeselect', Treeselect);
