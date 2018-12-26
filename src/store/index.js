import VuexPersistence from 'vuex-persist';
import Vue from 'vue';
import Vuex from 'vuex';
import configs from './configs';
import server from './server';
import metadata from './metadata';
import appconfig from './appconfig';
import elastalert from './elastalert';
import config from './config';
import ui from './ui';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: state => ({ ui: state.ui }),
  key: 'praeco-vuex'
});

export default new Vuex.Store({
  modules: {
    configs,
    server,
    metadata,
    appconfig,
    elastalert,
    config,
    ui
  },
  plugins: [vuexLocal.plugin]
});
