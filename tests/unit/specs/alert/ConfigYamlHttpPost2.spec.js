import { expect } from 'chai';
import { store, mockAxios } from '../../setup';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataHttpPost2.js';

describe('HttpPost2 YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "post2"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
http_post2_timeout: 10
http_post2_url:
  - "http://localhost/webhook"
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
