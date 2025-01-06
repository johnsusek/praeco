import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Errors from './views/Errors.vue';
import Silences from './views/Silences.vue';
import Queries from './views/Queries.vue';
import Folder from './views/Folder.vue';
import Templates from './views/Templates.vue';
import Rules from './views/Rules.vue';
import RuleView from './views/RuleView.vue';
import TemplateView from './views/TemplateView.vue';
import ConfigBuilder from './views/ConfigBuilder.vue';

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/errors',
      name: 'errors',
      component: Errors
    },
    {
      path: '/queries',
      name: 'Queries',
      component: Queries
    },
    {
      path: '/silences',
      name: 'silences',
      component: Silences
    },
    {
      path: '/templates',
      name: 'templates',
      component: Templates
    },
    {
      path: '/rules',
      name: 'rules',
      component: Rules
    },
    {
      path: '/folders/:type/:path*',
      name: 'folder',
      component: Folder,
      props: route => ({ ...route.params, ...route.query })
    },
    {
      path: '/rule/add/:path?',
      props: route => ({
        ...route.params,
        ...route.query,
        action: 'add',
        type: 'rule'
      }),
      name: 'ruleconfigbuilder',
      component: ConfigBuilder,
      meta: { type: 'rule' }
    },
    {
      path: '/rule/edit/:path?',
      props: route => ({
        ...route.params,
        ...route.query,
        action: 'edit',
        type: 'rule'
      }),
      name: 'ruleconfigeditor',
      component: ConfigBuilder,
      meta: { type: 'rule' }
    },
    {
      path: '/rules/:id',
      name: 'ruleview',
      props: route => ({ ...route.params, ...route.query }),
      component: RuleView
    },
    {
      path: '/template/add/:path?',
      props: route => ({
        ...route.params,
        ...route.query,
        action: 'add',
        type: 'template'
      }),
      name: 'templateconfigbuilder',
      component: ConfigBuilder,
      meta: { type: 'template' }
    },
    {
      path: '/template/edit/:path?',
      props: route => ({
        ...route.params,
        ...route.query,
        action: 'edit',
        type: 'template'
      }),
      name: 'templateconfigeditor',
      component: ConfigBuilder,
      meta: { type: 'template' }
    },
    {
      path: '/templates/:id',
      name: 'templateview',
      props: route => ({ ...route.params, ...route.query }),
      component: TemplateView
    }
  ]
});
export default router;
