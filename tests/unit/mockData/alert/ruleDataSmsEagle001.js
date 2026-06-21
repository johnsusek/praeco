export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - smseagle
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
generate_kibana_discover_url: true
import: BaseRule.config
index: hannibal-*
is_enabled: false
kibana_discover_app_url: 'http://kibana:5601/app/discover#/'
kibana_discover_from_timedelta:
  minutes: 10
kibana_discover_index_pattern_id: mariadblog
kibana_discover_to_timedelta:
  minutes: 10
kibana_discover_version: '7.16'
name: test123
num_events: 10000
realert:
  minutes: 5
shorten_kibana_discover_url: true
smseagle_url: 'https://192.168.1.101'
smseagle_token: '123abc456def789'
smseagle_message_type: 'sms'
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
