import { expect } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import RuleView from '@/views/RuleView.vue';
import { shallowMountComponent, mockAxios } from '../setup';
import { ruleYaml } from '../mockData/ruleData.js';

mockAxios.onGet('/api/metadata/elastalert').reply(200, {});
mockAxios.onGet('/api/metadata/silence').reply(200, {});
mockAxios.onGet('/api/metadata/elastalert_status').reply(200, {});
mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

describe('RuleView', () => {
  it('renders the rule', async () => {
    const wrapper = shallowMountComponent(RuleView, {
      propsData: {
        id: 'test123'
      },
      global: {
        stubs: {
          transition: false,
          'el-tag': false
        }
      }
    });

    await flushPromises();

    const app = wrapper.find('h1');
    expect(app.text()).to.equal('test123  Disabled');
  });
});