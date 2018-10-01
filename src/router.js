import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Errors from './views/Errors.vue';
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
      path: '/rule/:action/:template?',
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
      path: '/template/:action/:template?',
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
