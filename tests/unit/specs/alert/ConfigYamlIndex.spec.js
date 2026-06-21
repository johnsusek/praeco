import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../../setup.js';
import { ruleYaml } from '../../mockData/alert/ruleDataIndex.js';

describe('Indexer YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "indexer"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
import: "BaseRule.config"
index: "hannibal-*"
indexer_alert_config:
  message: "message"
  hostname: "hostname"
indexer_connection:
  indexer_alerts_name: "elastalert2"
  es_host: "localhost"
  es_port: 9200
  es_username: "user"
  es_password: "password"
  use_ssl: true
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
