export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - alerta
alert_subject: this is a test subject
alert_subject_args: []
alert_text: this is a test body
alert_text_args: []
alert_text_type: alert_text_only
alerta_api_key: a
alerta_api_url: http://testserver/
alerta_environment: b
alerta_event: c
alerta_group: g
alerta_origin: elastalert2
alerta_resource: c
alerta_severity: e
alerta_tags:
  - h
  - i
alerta_text: f
alerta_type: k
alerta_value: m
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
