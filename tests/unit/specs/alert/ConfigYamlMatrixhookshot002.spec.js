import { expect } from 'chai';
import { useConfigStore } from '@/stores/config/main.js';
import { mockAxios } from '../../setup.js';
import { ruleYaml } from '../../mockData/alert/ruleDataMatrixhookshot002.js';

describe('Matrixhookshot 002 YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    const configStore = useConfigStore();
    await configStore.load({ type: 'rules', path: 'test123' });
    let yaml = configStore.yaml();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "matrixhookshot"
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
matrixhookshot_ca_certs: true
matrixhookshot_ignore_ssl_errors: true
matrixhookshot_proxy: "http://localhost:8080"
matrixhookshot_text: "this is a test body"
matrixhookshot_timeout: 11
matrixhookshot_username: "test"
matrixhookshot_webhook_url:
  - "http://localhost:8080"
  - "http://localhost:8081"
name: "test123"
num_events: 10000
realert:
  minutes: 5
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
