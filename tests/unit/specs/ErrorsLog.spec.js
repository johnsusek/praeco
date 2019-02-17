import { expect } from 'chai';
import Errors from '@/views/Errors';
import mockErrorLog from '../mockData/errorsLog.json';
import { mountComponent, mockAxios } from '../setup';

mockAxios.onGet('/api/metadata/elastalert_error').reply(200, mockErrorLog);

describe('Errors log', () => {
  let wrapper = mountComponent(Errors);

  it('renders the rule', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(17)');
    return expect(tableRow.find('.el-table_1_column_1').text()).to.equal('Agg Test');
  });

  it('renders the error', () => {
    let tableRow = wrapper.find('.el-table__body-wrapper > table > tbody > tr:nth-child(17)');
    return expect(tableRow.find('.el-table_1_column_2').text()).to.contain('ConnectionTimeout');
  });
});
