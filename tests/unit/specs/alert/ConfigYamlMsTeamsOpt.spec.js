import { expect } from 'chai';
import { store, mockAxios } from '../../setup';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataMsTeamsOpt.js';

describe('MsTeamsOpt YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "ms_teams"
alert_subject: "this is a test subject"
alert_text: "this is a test body"
alert_text_type: "alert_text_only"
doc_type: "syslog"
filter:
  - query:
      query_string:
        query: "@timestamp:*"
generate_kibana_discover_url: true
import: "BaseRule.config"
index: "hannibal-*"
is_enabled: false
kibana_discover_from_timedelta:
  minutes: 10
kibana_discover_to_timedelta:
  minutes: 10
match_enhancements: []
ms_teams_alert_fixed_width: true
ms_teams_alert_summary: "Message"
ms_teams_attach_kibana_discover_url: true
ms_teams_ca_certs: true
ms_teams_kibana_discover_title: "Discover in Kibana2"
ms_teams_proxy: "hostname:8080"
ms_teams_webhook_url:
  - "a"
  - "b"
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
