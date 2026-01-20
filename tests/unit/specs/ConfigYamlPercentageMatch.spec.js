import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../setup';
import { ruleYaml } from '../mockData/ruleDataPercentageMatch.js';

describe('Percentage Match YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test_percentage_match').reply(200, ruleYaml);
    await store.dispatch('config/load', { type: 'rules', path: 'test_percentage_match' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test_percentage_match"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "alerta"
alert_subject: "Percentage match alert"
alert_text: "Percentage of matching documents exceeded threshold"
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
index: "test-*"
is_enabled: true
match_bucket_filter:
  - term:
      status: "error"
match_enhancements: []
max_percentage: 75
min_percentage: 25
name: "test_percentage_match"
realert:
  minutes: 5
timeframe:
  minutes: 15
timestamp_field: "@timestamp"
timestamp_type: "iso"
type: "percentage_match"
use_strftime_index: false
`;

    return expect(yaml).to.equal(expected);
  });

  it('loads percentage match configuration correctly', async () => {
    mockAxios.onGet('/api/rules/test_percentage_match').reply(200, ruleYaml);
    await store.dispatch('config/load', { type: 'rules', path: 'test_percentage_match' });

    expect(store.state.config.match.type).to.equal('percentage_match');
    expect(store.state.config.match.minPercentage).to.equal(25);
    expect(store.state.config.match.maxPercentage).to.equal(75);
    expect(store.state.config.match.timeframe).to.deep.equal({ minutes: 15 });
  });
});
