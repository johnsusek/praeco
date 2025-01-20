import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataEmail.js';

describe('Email YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "email"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
bcc:
  - "bcc@test.com"
cc:
  - "cc@test.com"
doc_type: "syslog"
email:
  - "to@test.com"
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
match_enhancements: []
name: "test123"
num_events: 10000
realert:
  minutes: 5
smtp_auth_file: "auth_file"
smtp_cert_file: "cert_file"
smtp_key_file: "key_file"
smtp_ssl: true
terms_size: 50
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
