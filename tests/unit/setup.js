import 'localstorage-polyfill';

import ElementPlus from 'element-plus';
import { mount, shallowMount } from '@vue/test-utils';
import { expect } from 'vitest';

import '@/contrib.js';
import '@/registration.js';

import store from '@/store';
import router from '@/router';

global.expect = expect;

export function mountComponent(comp, opts = {}) {
  return mount(comp, {
    attachTo: false,
    global: {
      plugins: [
        router,
        store,
        ElementPlus
      ],
      stubs: {
        transition: false
      }
    },
    props: opts.propsData
  });
}

export function shallowMountComponent(comp, opts = {}) {
  return shallowMount(comp, {
    attachTo: false,
    global: {
      plugins: [
        router,
        store,
        ElementPlus
      ],
      stubs: {
        transition: false
      }
    },
    props: opts.propsData
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