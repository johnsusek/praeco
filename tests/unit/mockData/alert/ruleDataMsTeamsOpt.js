export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - ms_teams
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
generate_kibana_discover_url: true
ms_teams_alert_fixed_width: true
ms_teams_alert_summary: Message
ms_teams_attach_kibana_discover_url: true
ms_teams_ca_certs: true
ms_teams_kibana_discover_title: Discover in Kibana2
ms_teams_proxy: hostname:8080
ms_teams_theme_color: #f0f8ff
ms_teams_webhook_url: https://xxxxxxxxxxxxxxxxxxxxxx/xxxx
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
