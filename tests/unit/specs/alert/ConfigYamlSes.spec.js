import { expect } from 'chai';
import { useConfigStore } from '@/stores/config/main.js';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataSes.js';

describe('Ses YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    const configStore = useConfigStore();
    await configStore.load({ type: 'rules', path: 'test123' });
    let yaml = configStore.yaml();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "ses"
alert_subject: "this is a test subject"
alert_subject_args: []
alert_text: "this is a test body"
alert_text_args: []
alert_text_type: "alert_text_only"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
name: "test123"
num_events: 10000
realert:
  minutes: 5
ses_aws_access_key_id: "xxxxx1"
ses_aws_region: "xxxxx2"
ses_aws_secret_access_key: "xxxxx3"
ses_bcc: "bcc@test.co.jp"
ses_cc: "cc@test.co.jp"
ses_email: "email@test.co.jp"
ses_email_add_domain: "testdomain"
ses_email_from_field: "from"
timeframe:
  minutes: 5
timestamp_field: "@timestamp"
timestamp_type: "iso"
type: "frequency"
use_count_query: true
use_strftime_index: false
`;

    return expect(yaml).to.equal(expected);
  });
});
