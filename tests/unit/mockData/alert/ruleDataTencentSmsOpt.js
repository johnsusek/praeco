export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - tencent_sms
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
tencent_sms_region: 'ap-guangzhou2'
tencent_sms_sdk_appid: 'xxxx1'
tencent_sms_secret_id: 'xxxx2'
tencent_sms_secret_key: 'xxxx3'
tencent_sms_sign_name: 'xxxx4'
tencent_sms_template_id: 'xxxx5'
tencent_sms_template_parm:
  - '/kubernetes/pod_name'
tencent_sms_to_number:
  - 'xxxx6'
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
