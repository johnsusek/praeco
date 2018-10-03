import Vue from 'vue';
import Vuex from 'vuex';
import configs from './configs';
import server from './server';
import config from './config';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    configs,
    server,
    config
  }
});
