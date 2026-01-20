export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - alerta
alert_subject: Spike aggregation alert
alert_subject_args: []
alert_text: Aggregated metric spiked above threshold
alert_text_args: []
alert_text_type: alert_text_only
filter:
  - query:
      query_string:
        query: '@timestamp:*'
import: BaseRule.config
index: metrics-*
is_enabled: true
metric_agg_key: cpu.usage
metric_agg_type: avg
name: test_spike_aggregation
realert:
  minutes: 5
spike_height: 2
spike_type: up
threshold_cur: 50
threshold_ref: 10
timeframe:
  hours: 1
timestamp_field: '@timestamp'
timestamp_type: iso
type: spike_aggregation
use_strftime_index: false
`;
