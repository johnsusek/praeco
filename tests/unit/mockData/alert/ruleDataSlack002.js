export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - slack
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
name: test123
num_events: 10000
realert:
  minutes: 5
slack_attach_jira_ticket_url: true
slack_attach_kibana_discover_url: true
slack_author_name: 'author_name'
slack_author_link: 'http://localhost/author'
slack_author_icon: 'http://localhost/icon.png'
slack_msg_pretext: 'abcd'
slack_ca_certs: true  
slack_channel_override:
  - '#elastalert-debugging'
  - '#elastalert-debugging2'
slack_emoji_override: ':postal_horn:'
slack_footer: 'footer'
slack_footer_icon: 'footer_icon'
slack_icon_url_override: 'http://test.com/xxxx.png'
slack_ignore_ssl_errors: true
slack_image_url: 'http://localhost/image.png'
slack_jira_ticket_color: '#ec4b96'
slack_jira_ticket_title: 'jira title'
slack_kibana_discover_color: '#ec4b98'
slack_kibana_discover_title: 'Discover in Kibana'
slack_msg_color: 'good'
slack_parse_override: 'none2'
slack_proxy: 'https://hostname:8080/'
slack_text_string: 'abc'
slack_thumb_url: 'http://localhost/thumb.png'
slack_title_link: 'http://localhost:8080/rules/test123'
slack_timeout: 20
slack_username_override: 'Praeco'
slack_webhook_url:
  - 'a'
  - 'b'
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
