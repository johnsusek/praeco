export const ruleYaml = `__praeco_query_builder: '{"query":{"logicalOperator":"all","children":[]}}'
alert:
  - ses
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
ses_aws_access_key_id: xxxxx1
ses_aws_region: xxxxx2
ses_aws_secret_access_key: xxxxx3
ses_bcc: bcc@test.co.jp
ses_cc: cc@test.co.jp
ses_email: email@test.co.jp
ses_email_add_domain: testdomain
ses_email_from_field: from
timeframe:
  minutes: 5
timestamp_field: '@timestamp'
timestamp_type: iso
type: frequency
use_count_query: true
use_strftime_index: false
`;
