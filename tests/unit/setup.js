import axios from 'axios';
import ElementPlus from 'element-plus';
import Vuex from 'vuex';
import MockAdapter from 'axios-mock-adapter';
import { createRouter as VueRouter } from 'vue-router';
import 'localstorage-polyfill';
import {
  config, mount, shallowMount, createLocalVue
} from '@vue/test-utils';
// import '@/contrib.js';
// import '@/registration.js';
import store from '@/store';
import router from '@/router';

config.stubs.transition = false;

export const mockAxios = new MockAdapter(axios);

export function mountComponent(comp, opts = {}) {
  let localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(ElementPlus);
  localVue.use(Vuex);

  return mount(comp, {
    attachTo: false,
    sync: false,
    localVue,
    router,
    store,
    propsData: opts.propsData
  });
}

export function shallowMountComponent(comp, opts = {}) {
  let localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(ElementPlus);
  localVue.use(Vuex);

  return shallowMount(comp, {
    attachTo: false,
    sync: false,
    localVue,
    router,
    store,
    propsData: opts.propsData
  });
}

class MutationObserver {
  constructor(callBack) {
    this.callBack = callBack;
  }

  observe(element) {
    this.element = element;
    return this.interval = setInterval(() => {
      const html = this.element.innerHTML;

      if (html !== this.oldHtml) {
        this.oldHtml = html;
        return this.callBack.apply(null);
      }
    }, 200);
  }

  disconnect() {
    return clearInterval(this.interval);
  }
}

global.MutationObserver = MutationObserver;

global.window.getSelection = function() {};
