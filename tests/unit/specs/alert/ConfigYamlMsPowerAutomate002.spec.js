import { expect } from 'chai';
import { store, mockAxios } from '../../setup';
import { mockAxios } from '../../setup.js';
import { ruleYaml } from '../../mockData/alert/ruleDataMsPowerAutomate002.js';

describe('MsPowerAutomate 002 YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "ms_power_automate"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
generateKibanaDiscoverUrl: true
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
match_enhancements: []
ms_power_automate_alert_summary: "summary"
ms_power_automate_body_text_size: "medium"
ms_power_automate_ca_certs: true
ms_power_automate_ignore_ssl_errors: true
ms_power_automate_kibana_discover_attach_url: "http://kibana/"
ms_power_automate_kibana_discover_color: "positive"
ms_power_automate_kibana_discover_title: "kibana title"
ms_power_automate_proxy: "http://localhost:8080/"
ms_power_automate_summary_text_size: "small"
ms_power_automate_teams_card_width_full: true
ms_power_automate_webhook_url:
  - "https://xxxxxxxxxxxxxxxxxxxxxx/xxxx"
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
