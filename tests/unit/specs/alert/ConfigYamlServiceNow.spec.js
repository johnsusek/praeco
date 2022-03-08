import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataServiceNow.js';

mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

describe('ServiceNow YAML parsing', () => {
  it('renders the correct yaml', async () => {
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });

    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "servicenow"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
assignment_group: "a1"
caller_id: "a2"
category: "a3"
cmdb_ci: "a4"
comments: "a5"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
generate_kibana_discover_url: false
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
match_enhancements: []
name: "test123"
num_events: 10000
password: "a6"
realert:
  minutes: 5
servicenow_impact: "a7"
servicenow_proxy: "hostname:8080"
servicenow_rest_url: "http://testserver/"
servicenow_urgency: "a11"
short_description: "a8"
subcategory: "a9"
terms_size: 50
timeframe:
  minutes: 5
timestamp_field: "@timestamp"
timestamp_type: "iso"
type: "frequency"
use_count_query: true
use_strftime_index: false
username: "a10"
`;

    return expect(yaml).to.equal(expected);
  });
});
