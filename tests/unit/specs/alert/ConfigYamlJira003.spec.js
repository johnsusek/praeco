import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataJira003.js';

mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

describe('Jira 003 YAML parsing', () => {
  it('renders the correct yaml', async () => {
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });

    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "jira"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
generate_kibana_discover_url: false
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
jira_assignee: "assign"
jira_bump_after_inactivity: 2
jira_bump_in_statuses:
  - "a"
  - "b"
jira_bump_not_in_statuses:
  - "c"
  - "d"
jira_components: "xxxxxx1"
jira_description: "desc"
jira_issuetype: "xxxxxx2"
jira_label:
  - "e"
  - "f"
jira_labels:
  - "g"
  - "h"
jira_max_age: 3
jira_priority: 1
jira_project: "xxxxxx3"
jira_transition_to: "trans"
jira_watchers:
  - "i"
  - "j"
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
