import { nextTick } from 'vue';
import { expect } from 'chai';

import store from '@/store';
import ConfigCondition from '@/components/config/ConfigCondition.vue';
import { mountComponent, mockAxios } from '../setup';
import mockChartData from '../mockData/chartData.json';

const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - slack
doc_type: syslog
filter:
  - query:
      query_string:
        query: '@timestamp:*'
import: BaseRule.config
index: hannibal-*
is_enabled: false
metric_agg_key: bytes
metric_agg_type: avg
name: spike-aggregation-test
query_key:
  - host.keyword
realert:
  minutes: 5
spike_height: 3
spike_type: up
threshold_cur: 60
threshold_ref: 10
timeframe:
  minutes: 15
timestamp_field: '@timestamp'
timestamp_type: iso
type: spike_aggregation
use_strftime_index: false
`;

describe('Spike aggregation rule type', () => {
  it('loads into ConfigCondition with spike aggregation UI state', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    mockAxios.onPost('/api/search/hannibal-*').reply(200, mockChartData);

    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    const wrapper = mountComponent(ConfigCondition);

    wrapper.setData({
      popAboveVisible: true,
      popOverVisible: true
    });

    await nextTick();

    expect(store.state.config.match.type).to.equal('spike_aggregation');
    expect(store.state.config.match.metricAggType).to.equal('avg');
    expect(wrapper.text()).to.contain('SPIKES');
    expect(wrapper.text()).to.contain('WHEN average');
  });

  it('exports spike aggregation YAML fields', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    const yaml = store.getters['config/yaml']();

    expect(yaml).to.contain('type: "spike_aggregation"');
    expect(yaml).to.contain('metric_agg_key: "bytes"');
    expect(yaml).to.contain('metric_agg_type: "avg"');
    expect(yaml).to.contain('spike_height: 3');
    expect(yaml).to.contain('spike_type: "up"');
    expect(yaml).to.contain('threshold_cur: 60');
    expect(yaml).to.contain('threshold_ref: 10');
  });
});
