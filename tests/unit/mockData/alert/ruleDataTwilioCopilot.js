export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - twilio
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
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
twilio_account_sid: ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567
twilio_auth_token: abcdefghijklmnopqrstuvwxyz012345
twilio_message_service_sid: ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567
twilio_to_number: '0123456789'
twilio_use_copilot: true
type: frequency
use_count_query: true
use_strftime_index: false
`;
