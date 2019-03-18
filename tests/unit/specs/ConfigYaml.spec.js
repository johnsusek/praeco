import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../setup';

let ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - slack
alert_subject: test subject
alert_subject_args: []
alert_text: test body
alert_text_args: []
alert_text_type: alert_text_only
doc_type: syslog
filter:
  - query:
      query_string:
        query: '@timestamp:*'
import: BaseRule.config
index: hannibal-*
is_enabled: false
name: test123
num_events: 10000
realert:
  minutes: 5
slack_channel_override: '#elastalert-debugging'
slack_msg_color: danger
slack_title_link: 'http://localhost:8080/rules/test123'
slack_username_override: Praeco
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;

mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

describe('YAML parsing', () => {
  it('renders the correct yaml', async () => {
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });

    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: test123
__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - slack
alert_subject: test subject
alert_subject_args: []
alert_text: test body
alert_text_args: []
alert_text_type: alert_text_only
doc_type: syslog
filter:
  - query:
      query_string:
        query: '@timestamp:*'
import: BaseRule.config
index: hannibal-*
is_enabled: false
name: test123
num_events: 10000
realert:
  minutes: 5
slack_channel_override: '#elastalert-debugging'
slack_msg_color: danger
slack_title_link: undefined/rules/test123
slack_username_override: Praeco
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;

    return expect(yaml).to.equal(expected);
  });
});
