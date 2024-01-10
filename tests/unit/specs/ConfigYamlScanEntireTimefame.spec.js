import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../setup';
import { ruleYaml } from '../mockData/ruleDataScanEntireTimefame.js';

describe('ScanEntireTimefame YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, ruleYaml);
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "alerta"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
alerta_environment: "Production"
alerta_event: "elastalert"
alerta_origin: "elastalert"
alerta_resource: "elastalert"
alerta_severity: "warning"
alerta_text: "elastalert"
alerta_type: "elastalert"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
match_enhancements: []
name: "test123"
num_events: 10000
realert:
  minutes: 5
scan_entire_timeframe: true
terms_size: 50
timeframe:
  minutes: 5
timestamp_field: "@timestamp"
timestamp_type: "iso"
type: "frequency"
use_count_query: true
use_strftime_index: false
`;

    return expect(yaml).to.equal(expected);
  });
});
