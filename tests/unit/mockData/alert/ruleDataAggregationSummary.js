export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
aggregation:
  schedule: '0 * * * *'
aggregation_key: host
alert:
  - email
doc_type: syslog
email: 'to@test.com'
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
  minutes: 0
summary_prefix: 'prefix'
summary_suffix: 'suffix'
summary_table_fields:
  - host
  - message
summary_table_max_rows: 10
summary_table_type: markdown
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
