import Vue from 'vue';
import { expect } from 'chai';

import store from '@/store';
import ConfigCondition from '@/components/config/ConfigCondition';
import { mountComponent, mockAxios } from '../setup';
import mockChartData from '../mockData/chartData.json';

let ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - slack
alert_subject: test subject
alert_subject_args: []
alert_text: test body
alert_text_args: []
alert_text_type: alert_text_only
doc_type: syslog
filter:
  - query:
      query_string:
        query: '@timestamp:*'
import: BaseRule.config
index: hannibal-*
is_enabled: false
name: test123
num_events: 10000
realert:
  minutes: 5
slack_channel_override: '#elastalert-debugging'
slack_msg_color: danger
slack_title_link: 'http://localhost:8080/rules/test123'
slack_username_override: Praeco
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;

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

  await Vue.nextTick();

  return wrapper;
}

let wrapper;

describe('ConfigCondition log', () => {
  it('renders the numEvents', async () => {
    wrapper = await prep();
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
