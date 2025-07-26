import axios from 'axios';
import ElementPlus from 'element-plus';
import MockAdapter from 'axios-mock-adapter';
import 'localstorage-polyfill';
import {
  config, mount, shallowMount
} from '@vue/test-utils';
import '@/contrib.js';
import '@/registration.js';
import store from '@/store/index.js';
import router from '@/router.js';

config.global.stubs.transition = false;

export const mockAxios = new MockAdapter(axios);

export function mountComponent(comp, opts = {}) {
  return mount(comp, {
    global: {
      plugins: [store, router, ElementPlus],
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
      plugins: [store, router, ElementPlus],
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

// Polyfill requestAnimationFrame for Element Plus components
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 16);
};

global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};
