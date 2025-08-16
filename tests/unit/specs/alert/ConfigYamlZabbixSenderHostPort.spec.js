import { expect } from 'chai';
import { useConfigStore } from '@/stores/config/main.js';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataZabbixSenderHostPort.js';

describe('YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    const configStore = useConfigStore();
    await configStore.load({ type: 'rules', path: 'test123' });
    let yaml = configStore.yaml();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "zabbix"
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
type: "frequency"
use_count_query: true
use_strftime_index: false
zbx_host: "test001"
zbx_key: "sender_load1"
zbx_sender_host: "test-server"
zbx_sender_port: 20000
`;

    return expect(yaml).to.equal(expected);
  });
});
