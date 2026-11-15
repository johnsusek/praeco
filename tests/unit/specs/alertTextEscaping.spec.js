import { expect, vi } from 'vitest';
import * as yaml from 'js-yaml';
import store from '@/store';
import { htmlToConfigFormat, configFormatToHtml } from '@/lib/alertText.js';
import ConfigAlertSubjectBody from '@/components/config/alert/ConfigAlertSubjectBody.vue';
import { mockAxios } from '../setup';

let payload = '<img src=x onerror="alert(1)"><script>alert(2)</script>';

let subject = `${payload} a < b && c > d "q" 'r' {0} <b>x</b> &amp; &nbsp;`;

let body = `${payload}
line two <b>bold</b> {0} & {1}

  indented "quoted" 'single' a<b>c
&lt;already escaped&gt;
`;

let ruleYaml = yaml.dump({
  name: 'escaping',
  type: 'any',
  index: 'hannibal-*',
  alert: ['slack'],
  alert_subject: subject,
  alert_subject_args: ['host'],
  alert_text: body,
  alert_text_args: ['host', 'message'],
});

mockAxios.onGet('/api/rules/escaping').reply(200, { yaml: ruleYaml });

describe('alert text escaping', () => {
  it('round-trips alert_subject and alert_text byte for byte', async () => {
    await store.dispatch('config/load', { type: 'rules', path: 'escaping' });

    let config = store.getters['config/config']();
    expect(config.alert_subject).to.equal(subject);
    expect(config.alert_text).to.equal(body);

    let dumped = yaml.load(store.getters['config/yaml']());
    expect(dumped.alert_subject).to.equal(subject);
    expect(dumped.alert_text).to.equal(body);
  });

  it('stores rule text escaped so the editor shows it literally', () => {
    expect(store.state.config.alert.subject).to.not.contain('<img');
    expect(store.state.config.alert.body).to.contain('&lt;script&gt;');
  });

  it('renders the preview from literal text', () => {
    expect(store.getters['config/alert/bodyRendered']).to.contain('<b>bold</b>');
  });

  it('parses html without creating elements in the live document', () => {
    let createElement = vi.spyOn(document, 'createElement');
    let parsed = htmlToConfigFormat(`before ${payload} after`);
    expect(createElement).not.toHaveBeenCalled();
    expect(parsed.alertText).to.equal('before  after');
    createElement.mockRestore();
  });

  it('keeps editor markup behaviour', () => {
    let html =
      'a <span data-at-embedded="" contenteditable="false"> <span data-term="host">host</span> </span><div>b</div><br>c';
    let parsed = htmlToConfigFormat(html);
    expect(parsed.alertText).to.equal('a {0}\nb\nc');
    expect(parsed.alertArgs).to.deep.equal(['host']);
  });

  it('escapes text and args in configFormatToHtml', () => {
    let html = configFormatToHtml('<b>{0}</b>\nnext', ['"><img src=x>']);
    let container = document.createElement('div');
    container.innerHTML = html;
    expect(container.querySelector('img')).to.equal(null);
    expect(container.querySelector('b')).to.equal(null);
    expect(container.querySelector('[data-term]').dataset.term).to.equal('"><img src=x>');
    expect(container.textContent).to.contain('<b>');
    expect(html).to.contain('<br>next');
  });

  it('pastes clipboard text as text, not markup', () => {
    let editor = document.createElement('div');
    editor.contentEditable = 'true';
    document.body.appendChild(editor);

    let range = document.createRange();
    range.selectNodeContents(editor);
    let getSelection = vi
      .spyOn(window, 'getSelection')
      .mockReturnValue({ getRangeAt: () => range, collapseToEnd: vi.fn() });

    let event = {
      preventDefault: vi.fn(),
      clipboardData: { getData: () => payload },
    };
    ConfigAlertSubjectBody.methods.pastePlainText(event);

    expect(editor.querySelector('img')).to.equal(null);
    expect(editor.querySelector('script')).to.equal(null);
    expect(editor.textContent).to.equal(payload);
    editor.remove();
    getSelection.mockRestore();
  });
});
