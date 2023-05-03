export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - rocketchat
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
generate_kibana_discover_url: true
rocket_chat_webhook_url:
  - a
  - b
rocket_chat_channel_override: '#elastalert-debugging'
rocket_chat_username_override: 'elastalert2'
rocket_chat_msg_color: 'good'
rocket_chat_ignore_ssl_errors: true
rocket_chat_proxy: 'https://hostname:8080'
rocket_chat_attach_kibana_discover_url: true
rocket_chat_kibana_discover_color: '#FFFFFFFF'
rocket_chat_kibana_discover_title: 'ijk'
rocket_chat_ca_certs: true
rocket_chat_timeout: 11
rocket_chat_text_string: 'aaa'
rocket_chat_emoji_override: ':ghost:'
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
