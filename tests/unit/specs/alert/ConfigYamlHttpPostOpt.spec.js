import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataHttpPostOpt.js';

mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });

describe('YAML parsing', () => {
  it('renders the correct yaml', async () => {
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });

    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "post"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
generate_kibana_discover_url: false
http_post_ca_certs: "/etc/certs/cert.pem"
http_post_ignore_ssl_errors: true
http_post_proxy: "host:8080"
http_post_timeout: 10
http_post_url: "http://localhost/webhook"
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
match_enhancements: []
name: "test123"
num_events: 10000
realert:
  minutes: 5
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
