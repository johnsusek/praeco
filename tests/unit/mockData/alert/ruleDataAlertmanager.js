export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - alertmanager
alert_subject: this is a test subject
alert_subject_args: []
alert_text: this is a test body
alert_text_args: []
alert_text_type: alert_text_only
alertmanager_ca_certs: true
alertmanager_ignore_ssl_errors: true
alertmanager_proxy: 'https://hostname:8080'
alertmanager_basic_auth_login: 'user'
alertmanager_basic_auth_password: 'pass'
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
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
