import { expect } from 'chai';
import RuleView from '@/views/RuleView';
import { shallowMountComponent, mockAxios } from '../setup';
import { ruleYaml } from '../mockData/ruleData.js';

mockAxios.onGet('/api/metadata/elastalert').reply(200, {});
mockAxios.onGet('/api/metadata/silence').reply(200, {});
mockAxios.onGet('/api/metadata/elastalert_status').reply(200, {});
mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

describe('RuleView', () => {
  let wrapper = shallowMountComponent(RuleView, {
    propsData: {
      id: 'test123'
    }
  });

  it('renders the rule', () => {
    let app = wrapper.find('h1');
    return expect(app.text()).to.equal('test123\n        Disabled');
  });
});
