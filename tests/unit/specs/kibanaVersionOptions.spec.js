import { expect } from 'chai';
import { kibanaVersionOptions } from '@/lib/kibanaVersionOptions.js';

describe('kibanaVersionOptions', () => {
  it('includes Kibana 9.4', () => {
    expect(kibanaVersionOptions).to.deep.include({
      code: '9.4',
      name: '9.4'
    });
  });
});
