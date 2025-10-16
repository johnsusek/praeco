import { expect } from 'chai';
import { store, mockAxios } from '../../setup';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataMattermost002.js';

describe('Mattermost 002 YAML parsing', () => {
  it('renders the correct yaml', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });
    let yaml = store.getters['config/yaml']();

    let expected = `__praeco_full_path: "test123"
__praeco_query_builder: "{\\"query\\":{\\"logicalOperator\\":\\"all\\",\\"children\\":[]}}"
alert:
  - "mattermost"
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
match_enhancements: []
mattermost_attach_kibana_discover_url: true
mattermost_author_icon: "author_icon"
mattermost_author_link: "author_link"
mattermost_author_name: "author_name"
mattermost_channel_override:
  - "#elastalert-debugging"
  - "#elastalert-debugging2"
mattermost_emoji_override: ":postal_horn:"
mattermost_footer: "footer"
mattermost_footer_icon: "footer_icon"
mattermost_ignore_ssl_errors: true
mattermost_image_url: "https://localhost/image.png"
mattermost_kibana_discover_color: "#FFFFFFFF"
mattermost_kibana_discover_title: "ijk"
mattermost_msg_color: "good"
mattermost_msg_pretext: "abc"
mattermost_proxy: "https://hostname:8080"
mattermost_thumb_url: "https://localhost/thumb.png"
mattermost_title: "cde"
mattermost_title_link: "fgh"
mattermost_username_override: "elastalert2"
mattermost_webhook_url:
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
