import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Errors from './views/Errors.vue';
import Folder from './views/Folder.vue';
import Templates from './views/Templates.vue';
import Rules from './views/Rules.vue';
import RuleView from './views/RuleView.vue';
import TemplateView from './views/TemplateView.vue';
import ConfigBuilder from './views/ConfigBuilder.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
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
      path: '/rule/:action/:path?',
      props: route => ({ ...route.params, ...route.query, type: 'rule' }),
      name: 'ruleconfigbuilder',
      component: ConfigBuilder,
      meta: { type: 'rule' }
    },
    {
      path: '/rules/:id',
      name: 'ruleview',
      props: true,
      component: RuleView
    },
    {
      path: '/template/:action/:path?',
      props: route => ({ ...route.params, ...route.query, type: 'template' }),
      name: 'templateconfigbuilder',
      component: ConfigBuilder,
      meta: { type: 'template' }
    },
    {
      path: '/templates/:id',
      name: 'templateview',
      props: true,
      component: TemplateView
    }
  ]
});
