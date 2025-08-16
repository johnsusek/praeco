import { expect } from 'chai';
import { store, mockAxios } from '../../setup';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataVictorOps.js';

describe('VictorOps YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "victorops"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
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
victorops_api_key: "xxxx1"
victorops_entity_display_name: "no entity display name"
victorops_entity_id: "xxxx2"
victorops_message_type: "xxxx3"
victorops_proxy: "xxxx4"
victorops_routing_key: "xxxx5"
`;

    return expect(yaml).to.equal(expected);
  });
});
