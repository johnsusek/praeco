export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - flashduty
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
query_key: beat.hostname
realert:
  minutes: 5
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
flashduty_alert_key: 'abc1'
flashduty_app: 'app'
flashduty_check: 'Too many occurrences of error logs'
flashduty_cluster: 'k8s'
flashduty_description: 'log error'
flashduty_env: 'dev'
flashduty_event_status: 'Warning'
flashduty_group: 'sre'
flashduty_integration_key: 'xxx'
flashduty_metric: 'The number of error logs is greater than 5'
flashduty_resource: 'index_name'
flashduty_service: 'service_name'
flashduty_title: 'elastalert'
`;
