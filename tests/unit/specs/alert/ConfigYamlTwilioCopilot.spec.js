import { expect } from 'chai';
import { useConfigStore } from '@/stores/config/main.js';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataTwilioCopilot.js';

describe('TwilioCopilot YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    const configStore = useConfigStore();
    await configStore.load({ type: 'rules', path: 'test123' });
    let yaml = configStore.yaml();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "twilio"
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
timeframe:
  minutes: 5
timestamp_field: "@timestamp"
timestamp_type: "iso"
twilio_account_sid: "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567"
twilio_auth_token: "abcdefghijklmnopqrstuvwxyz012345"
twilio_message_service_sid: "ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567"
twilio_to_number: "0123456789"
twilio_use_copilot: true
type: "frequency"
use_count_query: true
use_strftime_index: false
`;

    return expect(yaml).to.equal(expected);
  });
});
