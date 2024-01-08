import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataAlerta002.js';

mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

describe('Alerta 002 YAML parsing', () => {
  it('renders the correct yaml', async () => {
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });

    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "alerta"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
alerta_api_key: "a"
alerta_api_skip_ssl: true
alerta_api_url: "http://testserver/"
alerta_attributes_keys:
  - "a"
  - "b"
alerta_attributes_values:
  - "c"
  - "d"
alerta_correlate:
  - "e"
  - "f"
alerta_environment: "Production"
alerta_event: "elastalert"
alerta_origin: "elastalert"
alerta_resource: "elastalert"
alerta_service:
  - "g"
  - "h"
alerta_severity: "warning"
alerta_text: "elastalert"
alerta_timeout: 88000
alerta_type: "elastalert"
alerta_use_match_timestamp: true
alerta_use_qk_as_resource: true
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
