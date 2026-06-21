export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - indexer
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
indexer_connection:
  es_host: localhost
  es_port: 9200
  es_username: user
  es_password: password
  use_ssl: true
  indexer_alerts_name: elastalert2
indexer_alert_config:
  message: message
  hostname: hostname
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
