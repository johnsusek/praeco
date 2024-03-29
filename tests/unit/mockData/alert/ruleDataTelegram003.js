export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - telegram
alert_subject: this is a test subject
alert_subject_args: []
alert_text: this is a test body
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
telegram_parse_mode: html
telegram_proxy: hostname:8080
telegram_proxy_login: user
telegram_proxy_pass: password
telegram_room_id: http://testserver
telegram_thread_id: 123456789
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
