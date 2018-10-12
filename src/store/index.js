import Vue from 'vue';
import Vuex from 'vuex';
import configs from './configs';
import server from './server';
import metadata from './metadata';
import appconfig from './appconfig';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    configs,
    server,
    metadata,
    appconfig,
    config
  }
});
