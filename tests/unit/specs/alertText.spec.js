import { expect } from 'chai';
import { htmlToConfigFormat, configFormatToHtml } from '@/lib/alertText.js';

describe('alertText', () => {
  it('returns config-formatted alert text', () => {
    let text =
      'Test <span data-at-embedded="" contenteditable="false"> <span class="el-tag el-tag--info el-tag--mini" data-term="message">message<!----></span> </span>&nbsp;<div><br></div><div>123</div><div>&nbsp;b<span data-at-embedded="" contenteditable="false"> <span data-v-2d7a3f54="" class="el-tag el-tag--info el-tag--mini" data-term="@timestamp">@timestamp<!----></span> </span>&nbsp;aa</div><br><div>foo</div><div><br></div><div>bar</div><div><br></div><div>--baz</div>';
    let alertText = htmlToConfigFormat(text);
    let expectedText = `Test {0} 

123
 b{1} aa

foo

bar

--baz`;
    expect(alertText.alertArgs[0]).to.equal('message');
    expect(alertText.alertText).to.equal(expectedText);
  });

  it('returns html-formatted alert text', () => {
    let text = 'test {0} foo';
    let args = ['SRX.destination_zone'];

    let html =
      'test <span data-at-embedded="" contenteditable="false"> <span class="el-tag el-tag--info el-tag--mini" data-term="SRX.destination_zone">SRX.destination_zone<!----></span> </span> foo';

    let formatted = configFormatToHtml(text, args);

    expect(formatted).to.equal(html);
  });
});
