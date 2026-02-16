import { nextTick } from 'vue';
import { expect } from 'chai';

import store from '@/store';
import ConfigCondition from '@/components/config/ConfigCondition.vue';
import { mountComponent, mockAxios } from '../setup';
import mockChartData from '../mockData/chartData.json';
import { ruleYaml } from '../mockData/ruleData.js';

mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
mockAxios.onPost('/api/search/hannibal-*').reply(200, mockChartData);

async function prep() {
  await store.dispatch('config/load', { type: 'rules', path: 'test123' });
  let wrapper = mountComponent(ConfigCondition);

  wrapper.setData({
    popAboveVisible: true,
    popOverVisible: true,
    popOptionsVisible: true
  });

  await nextTick();

  return wrapper;
}

let wrapper;

describe('ConfigCondition log', async () => {
  wrapper = await prep();

  it('renders the numEvents', async () => {
    return expect(wrapper.text()).to.contain('ABOVE 10000');
  });

  it('renders the aboveOrBelow', async () => {
    return expect(wrapper.find('#aboveOrBelow').element.value).to.equal('Above');
  });

  it('renders the WHEN count', async () => {
    return expect(wrapper.text()).to.contain('WHEN count');
  });

  it('renders the OVER all documents', async () => {
    return expect(wrapper.text()).to.contain('OVER all documents');
  });

  it('renders the UNFILTERED', async () => {
    return expect(wrapper.text()).to.contain('UNFILTERED');
  });

  it('renders the GROUPED OVER field', async () => {
    return expect(wrapper.find('#groupedOverAll input').element.value).to.equal('all');
  });

  it('renders the timeframe interval', async () => {
    return expect(wrapper.find('#timeframe .el-select input').element.value).to.equal('Minutes');
  });

  it('renders the timeframe amount', async () => {
    return expect(wrapper.find('#timeframe .el-input-number input').element.value).to.equal('5');
  });

  it('renders the WITH OPTIONS useCountQuery', async () => {
    return expect(wrapper.find('#useCountQuery').element.value).to.equal('on');
  });

  it('renders the WITH OPTIONS docType', async () => {
    return expect(wrapper.find('#docType').element.value).to.equal('syslog');
  });
});
