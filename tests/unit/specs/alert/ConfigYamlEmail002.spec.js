import { expect } from 'chai';
import { useConfigStore } from '@/stores/config.js';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataEmail002.js';

describe('Email 002 YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    const configStore = useConfigStore();
    await configStore.load({ type: 'rules', path: 'test123' });
    let yaml = configStore.yaml();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "email"
alert_subject: "this is a test subject"
alert_subject_args: []
alert_text: "this is a test body"
alert_text_args: []
alert_text_type: "alert_text_only"
bcc: "bcc@test.com"
  - "bcc2@test.com"
cc: "cc@test.com"
  - "cc2@test.com"
doc_type: "syslog"
email: "to@test.com"
  - "to2@test.com"
email_add_domain: "test001.com"
email_from_field: "a"
email_reply_to: "admin@test.com"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
from_addr: "abc"
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
name: "test123"
num_events: 10000
realert:
  minutes: 5
smtp_auth_file: "auth_file"
smtp_cert_file: "cert_file"
smtp_key_file: "key_file"
smtp_port: 465
smtp_ssl: true
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
