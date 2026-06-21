import { expect } from 'chai';
import store from '@/store';
import { mockAxios } from '../../setup';
import { ruleYaml } from '../../mockData/alert/ruleDataAggregationSummary.js';

describe('Aggregation summary YAML parsing', () => {
  it('loads and exports summary table options', async () => {
    mockAxios.onGet('/api/rules/test123').reply(200, { yaml: ruleYaml });
    await store.dispatch('config/load', { type: 'rules', path: 'test123' });

    expect(store.state.config.alert.summaryTableType).to.equal('markdown');
    expect(store.state.config.alert.summaryPrefix).to.equal('prefix');
    expect(store.state.config.alert.summarySuffix).to.equal('suffix');
    expect(store.state.config.alert.summaryTableMaxRows).to.equal(10);

    expect(store.getters['config/aggregation']).to.deep.equal({
      aggregation: {
        schedule: '0 * * * *'
      },
      summary_table_fields: ['host', 'message'],
      summary_table_type: 'markdown',
      summary_prefix: 'prefix',
      summary_suffix: 'suffix',
      summary_table_max_rows: 10,
      aggregation_key: 'host'
    });
  });
});
