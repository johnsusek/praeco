export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - alerta
alert_subject: Percentage match alert
alert_subject_args: []
alert_text: Percentage of matching documents exceeded threshold
alert_text_args: []
alert_text_type: alert_text_only
filter:
  - query:
      query_string:
        query: '@timestamp:*'
import: BaseRule.config
index: test-*
is_enabled: true
match_bucket_filter:
  - term:
      status: error
max_percentage: 75
min_percentage: 25
name: test_percentage_match
realert:
  minutes: 5
timeframe:
  minutes: 15
timestamp_field: '@timestamp'
timestamp_type: iso
type: percentage_match
use_strftime_index: false
`;
