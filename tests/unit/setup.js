import axios from 'axios';
import ElementPlus from 'element-plus';
import { createStore } from 'vuex';
import MockAdapter from 'axios-mock-adapter';
import { createRouter, createWebHistory } from 'vue-router';
import 'localstorage-polyfill';
import {
  config, mount, shallowMount
} from '@vue/test-utils';
import '@/contrib.js';
import '@/registration.js';
import storeConfig from '@/store';
import routerConfig from '@/router';

config.global.stubs.transition = false;

export const mockAxios = new MockAdapter(axios);

// Create store and router instances for testing
const store = createStore(storeConfig);
const router = createRouter({
  history: createWebHistory(),
  routes: routerConfig.options.routes
});

export function mountComponent(comp, opts = {}) {
  return mount(comp, {
    global: {
      plugins: [ElementPlus, store, router],
      stubs: {
        transition: false
      }
    },
    props: opts.propsData || {}
  });
}

export function shallowMountComponent(comp, opts = {}) {
  return shallowMount(comp, {
    global: {
      plugins: [ElementPlus, store, router],
      stubs: {
        transition: false
      }
    },
    props: opts.propsData || {}
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
