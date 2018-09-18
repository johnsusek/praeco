import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Rules from './views/Rules.vue';
import RuleView from './views/RuleView.vue';
import Templates from './views/Templates.vue';
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
      path: '/rules',
      name: 'rules',
      component: Rules,
      children: [
        {
          path: '/rule/:action/:rule?',
          props: route => ({ ...route.params, ...route.query, type: 'rule' }),
          name: 'ruleconfigbuilder',
          component: ConfigBuilder
        },
        {
          path: '/rules/:id',
          name: 'ruleview',
          props: true,
          component: RuleView
        }
      ]
    },
    {
      path: '/templates',
      name: 'templates',
      component: Templates,
      children: [
        {
          path: '/template/:action/:template?',
          props: route => ({ ...route.params, ...route.query, type: 'template' }),
          name: 'templateconfigbuilder',
          component: ConfigBuilder
        },
        {
          path: '/templates/:id',
          name: 'templateview',
          props: true,
          component: TemplateView
        }
      ]
    }
  ]
});
