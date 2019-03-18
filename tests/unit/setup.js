import axios from 'axios';
import ElementUI from 'element-ui';
import Vuex from 'vuex';
import MockAdapter from 'axios-mock-adapter';
import VueRouter from 'vue-router';
import 'localstorage-polyfill';
import { config, mount, shallowMount, createLocalVue } from '@vue/test-utils';
import '@/contrib.js';
import '@/registration.js';
import store from '@/store';
import router from '@/router';

config.stubs.transition = false;

export const mockAxios = new MockAdapter(axios);

export function mountComponent(comp, opts = {}) {
  let localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(ElementUI);
  localVue.use(Vuex);

  return mount(comp, {
    attachToDocument: true,
    localVue,
    router,
    store,
    propsData: opts.propsData
  });
}

export function shallowMountComponent(comp, opts = {}) {
  let localVue = createLocalVue();
  localVue.use(VueRouter);
  localVue.use(ElementUI);
  localVue.use(Vuex);

  return shallowMount(comp, {
    attachToDocument: true,
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

