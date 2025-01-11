export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - matrixhookshot
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
matrixhookshot_ca_certs: true
matrixhookshot_ignore_ssl_errors: true
matrixhookshot_proxy: 'http://localhost:8080'
matrixhookshot_text: 'this is a test body'
matrixhookshot_timeout: 11
matrixhookshot_username: 'test'
matrixhookshot_webhook_url: 
  - 'http://localhost:8080'
  - 'http://localhost:8081'
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
