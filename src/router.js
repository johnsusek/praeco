import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Rules from './views/Rules.vue';
import RuleView from './views/RuleView.vue';
import RuleAddEdit from './views/RuleAddEdit.vue';
import Templates from './views/Templates.vue';
import TemplateView from './views/TemplateView.vue';
import TemplateAddEdit from './views/TemplateAddEdit.vue';

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
          path: '/rule/add/:template',
          props: true,
          name: 'ruleadd',
          component: RuleAddEdit,
          meta: { mode: 'add' }
        },
        {
          path: '/rule/edit/:template',
          props: true,
          name: 'ruleedit',
          component: RuleAddEdit,
          meta: { mode: 'edit' }
        },
        {
          path: '/rule/dupe/:template',
          props: true,
          name: 'ruledupe',
          component: RuleAddEdit,
          meta: { mode: 'dupe' }
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
          path: '/template/add/:template',
          props: true,
          name: 'templateadd',
          component: TemplateAddEdit,
          meta: { mode: 'add' }
        },
        {
          path: '/template/edit/:template',
          props: true,
          name: 'templateedit',
          component: TemplateAddEdit,
          meta: { mode: 'edit' }
        },
        {
          path: '/template/add/',
          component: TemplateAddEdit,
          meta: { mode: 'add' }
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
