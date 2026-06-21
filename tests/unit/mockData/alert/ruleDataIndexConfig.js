export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - indexer
doc_type: syslog
filter:
  - query:
      query_string:
        query: '@timestamp:*'
import: BaseRule.config
index: hannibal-*
indexer_config: /etc/elastalert/config.yaml
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
