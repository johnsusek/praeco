import Vue from 'vue';
import Vuex from 'vuex';
import rules from './rules';
import templates from './templates';
import server from './server';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    rules,
    templates,
    server,
    config
  }
});
