import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../setup';
import { ruleYaml } from '../mockData/ruleDataSpikeAggregation.js';

describe('Spike Aggregation YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test_spike_aggregation').reply(200, ruleYaml);
    await store.dispatch('config/load', { type: 'rules', path: 'test_spike_aggregation' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test_spike_aggregation"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "alerta"
alert_subject: "Spike aggregation alert"
alert_text: "Aggregated metric spiked above threshold"
alert_text_type: "alert_text_only"
alerta_environment: "Production"
alerta_event: "elastalert"
alerta_origin: "elastalert"
alerta_resource: "elastalert"
alerta_severity: "warning"
alerta_text: "elastalert"
alerta_type: "elastalert"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
import: "BaseRule.config"
index: "metrics-*"
is_enabled: true
match_enhancements: []
metric_agg_key: "cpu.usage"
metric_agg_type: "avg"
name: "test_spike_aggregation"
realert:
  minutes: 5
spike_height: 2
spike_type: "up"
threshold_cur: 50
threshold_ref: 10
timeframe:
  hours: 1
timestamp_field: "@timestamp"
timestamp_type: "iso"
type: "spike_aggregation"
use_strftime_index: false
`;

    return expect(yaml).to.equal(expected);
  });

  it('loads spike aggregation configuration correctly', async () => {
    mockAxios.onGet('/api/rules/test_spike_aggregation').reply(200, ruleYaml);
    await store.dispatch('config/load', { type: 'rules', path: 'test_spike_aggregation' });

    expect(store.state.config.match.type).to.equal('spike_aggregation');
    expect(store.state.config.match.spikeAggMetricAggKey).to.equal('cpu.usage');
    expect(store.state.config.match.spikeAggMetricAggType).to.equal('avg');
    expect(store.state.config.match.spikeHeight).to.equal(2);
    expect(store.state.config.match.spikeType).to.equal('up');
    expect(store.state.config.match.thresholdRef).to.equal(10);
    expect(store.state.config.match.thresholdCur).to.equal(50);
    expect(store.state.config.match.timeframe).to.deep.equal({ hours: 1 });
  });
});
